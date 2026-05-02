from __future__ import annotations

from io import BytesIO
from typing import Optional

import requests
import tweepy
from requests_oauthlib import OAuth1


class TwitterPostService:
    """Publishes tweets via Twitter API v2 (tweepy Client)."""

    def __init__(
        self,
        consumer_key: str,
        consumer_secret: str,
        access_token: str,
        access_token_secret: str,
    ) -> None:
        self._auth = tweepy.OAuth1UserHandler(
            consumer_key,
            consumer_secret,
            access_token,
            access_token_secret,
        )
        self._api = tweepy.API(self._auth)
        self._client = tweepy.Client(
            consumer_key=consumer_key,
            consumer_secret=consumer_secret,
            access_token=access_token,
            access_token_secret=access_token_secret,
        )
        
        # For API v2 calls that need Bearer token
        self._bearer_token = access_token  # Use access token as bearer token

    def _upload_image(self, image_url: str) -> str:
        response = requests.get(image_url, timeout=20)
        response.raise_for_status()

        with BytesIO(response.content) as image_bytes:
            media = self._api.media_upload(
                filename="image.jpg",
                file=image_bytes,
            )
        media_id = str(getattr(media, "media_id_string", "") or getattr(media, "media_id", ""))
        if not media_id:
            raise RuntimeError("Twitter media upload returned empty media id")
        return media_id

    def post_tweet(self, text: str, max_length: int = 280, image_url: Optional[str] = None, poll_options: Optional[list[str]] = None, poll_duration_minutes: int = 1440) -> dict[str, str]:
        # If poll options are provided, use the poll posting method
        if poll_options and len(poll_options) >= 2:
            return self._post_poll_tweet(text, poll_options, poll_duration_minutes)
        
        cleaned = text.strip()
        if not cleaned:
            raise ValueError("Tweet text is empty")
        if len(cleaned) > max_length:
            cleaned = cleaned[:max_length]

        media_ids: Optional[list[str]] = None
        if image_url and image_url.strip():
            media_ids = [self._upload_image(image_url.strip())]

        response = self._client.create_tweet(text=cleaned, media_ids=media_ids)
        if not response or not response.data:
            raise RuntimeError("Twitter API returned no tweet data")
        data = response.data
        if isinstance(data, dict):
            tweet_id = str(data.get("id", ""))
            posted_text = str(data.get("text", cleaned))
        else:
            tweet_id = str(getattr(data, "id", ""))
            posted_text = str(getattr(data, "text", cleaned))
        return {"tweet_id": tweet_id, "text": posted_text}

    def _post_poll_tweet(self, text: str, poll_options: list[str], duration_minutes: int = 1440) -> dict[str, str]:
        """
        Post a tweet with a poll using raw Twitter API v2 with OAuth 1.0a.
        
        Args:
            text: Tweet text
            poll_options: List of poll options (2-4 options)
            duration_minutes: Poll duration in minutes
            
        Returns:
            Dict with tweet_id and text
        """
        import json
        
        # Prepare poll data
        poll_data = {
            "options": poll_options[:4],  # Max 4 options
            "duration_minutes": duration_minutes
        }
        
        # Prepare tweet data
        tweet_data = {
            "text": text.strip(),
            "poll": poll_data
        }
        
        # Create OAuth 1.0a authentication
        oauth = OAuth1(
            self._client.consumer_key,
            self._client.consumer_secret,
            self._client.access_token,
            self._client.access_token_secret
        )
        
        # Make direct API call with OAuth 1.0a
        url = "https://api.twitter.com/2/tweets"
        headers = {
            "Content-Type": "application/json"
        }
        
        response = requests.post(url, headers=headers, data=json.dumps(tweet_data), auth=oauth, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        tweet_data = result.get("data", {})
        
        return {
            "tweet_id": str(tweet_data.get("id", "")),
            "text": str(tweet_data.get("text", text))
        }
