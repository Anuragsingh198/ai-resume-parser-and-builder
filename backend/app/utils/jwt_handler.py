
# Import the jose library (python-jose) - a Python library for encoding and decoding JWT tokens
# python-jose is already installed in requirements.txt
from jose import jwt, JWTError

# Import datetime and timedelta for handling token expiration
from datetime import datetime, timedelta

# Import HTTPException from FastAPI to raise HTTP errors when token verification fails
from fastapi import HTTPException, status

# Import the settings object to access JWT configuration (SECRET_KEY, ALGORITHM, etc.)
from app.config.settings import settings


def create_access_token(data: dict) -> str:
    """
    Creates a JWT access token with user data and expiration time.
    
    Args:
        data (dict): Dictionary containing user information to encode in the token.
                    Typically contains {"sub": user_id} where "sub" (subject) is the standard JWT claim for user ID.
    
    Returns:
        str: A signed JWT token string that can be sent to the client.
    
    Example:
        token = create_access_token(data={"sub": "123e4567-e89b-12d3-a456-426614174000"})
    """
    
    # Create a copy of the input data dictionary to avoid modifying the original
    to_encode = data.copy()
    
    # Calculate the expiration time by adding ACCESS_TOKEN_EXPIRE_MINUTES to the current UTC time
    # datetime.utcnow() gets the current UTC time
    # timedelta(minutes=...) creates a time duration object
    # The result is stored in 'exp' (expiration) claim, which is a standard JWT claim
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Add the expiration time to the token data
    # 'exp' is a reserved JWT claim that indicates when the token expires
    to_encode.update({"exp": expire})
    
    # Encode the data into a JWT token string
    # jwt.encode() takes:
    #   - claims: the data dictionary to encode (to_encode)
    #   - key: the secret key used to sign the token (settings.SECRET_KEY)
    #         This ensures the token hasn't been tampered with
    #   - algorithm: the encryption algorithm to use (settings.ALGORITHM, typically "HS256")
    # Returns a string containing the encoded JWT token
    encoded_jwt = jwt.encode(
        claims=to_encode,
        key=settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt


def verify_token(token: str) -> dict:
    """
    Verifies and decodes a JWT token, returning the payload data.
    
    Args:
        token (str): The JWT token string to verify and decode.
    
    Returns:
        dict: The decoded payload containing user information (e.g., {"sub": user_id, "exp": timestamp}).
    
    Raises:
        HTTPException: If the token is invalid, expired, or cannot be decoded.
    
    Example:
        payload = verify_token(token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        user_id = payload.get("sub")
    """
    
    try:
        # Decode and verify the JWT token
        # jwt.decode() takes:
        #   - token: the token string to decode
        #   - key: the same secret key used to sign the token (must match!)
        #   - algorithms: list of allowed algorithms (must include the one used to sign)
        # Returns the decoded payload as a dictionary
        payload = jwt.decode(
            token=token,
            key=settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        
        # Return the decoded payload containing user information
        return payload
        
    except JWTError:
        # JWTError is raised for any token validation error:
        # - Token has expired (past the 'exp' claim time)
        # - Token signature doesn't match (token was tampered with)
        # - Token format is invalid
        # - Token is missing required claims
        # Raise an HTTP 401 Unauthorized error with a descriptive message
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token. Please login again."
        )
