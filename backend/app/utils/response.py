"""
Response Utility Module

This module provides helper functions to create standardized API responses.
These functions ensure consistent response format across all API endpoints.
"""

# Import HTTP status codes from FastAPI for type hints
from fastapi import status

# Import the APIResponse and ErrorDetail models from schemas
from app.schemas.response import APIResponse, ErrorDetail

# Import typing for type hints
from typing import Any, Optional, List, Dict


def success_response(
    data: Any = None,
    message: str = "Request successful",
    status_code: int = status.HTTP_200_OK,
    meta: Optional[Dict[str, Any]] = None
) -> APIResponse:
    """
    Creates a standardized success response for API endpoints.
    
    Args:
        data (Any, optional): The response data to return. Can be any serializable object.
                            Defaults to None.
        message (str): A human-readable success message. Defaults to "Request successful".
        status_code (int): HTTP status code. Defaults to 200 OK.
                          Note: This is for reference, FastAPI will use the actual status_code
                          from the route decorator or exception.
        meta (Dict[str, Any], optional): Additional metadata like pagination info.
                                        Defaults to None.
    
    Returns:
        APIResponse: A standardized response object with success=True.
    
    Example:
        return success_response(
            data={"user_id": 123, "name": "John"},
            message="User created successfully",
            status_code=status.HTTP_201_CREATED
        )
    """
    
    # Create and return an APIResponse object with success=True
    # This ensures all successful responses follow the same structure:
    # {
    #   "success": true,
    #   "message": "...",
    #   "data": {...},
    #   "errors": null,
    #   "meta": {...}
    # }
    return APIResponse(
        success=True,           # Indicates the request was successful
        message=message,        # Human-readable success message
        data=data,              # The actual response data
        errors=None,            # No errors for successful responses
        meta=meta              # Optional metadata (pagination, etc.)
    )


def error_response(
    message: str = "Request failed",
    errors: Optional[List[ErrorDetail]] = None,
    status_code: int = status.HTTP_400_BAD_REQUEST,
    meta: Optional[Dict[str, Any]] = None
) -> APIResponse:
    """
    Creates a standardized error response for API endpoints.
    
    Args:
        message (str): A human-readable error message. Defaults to "Request failed".
        errors (List[ErrorDetail], optional): List of detailed error objects.
                                             Each ErrorDetail contains:
                                             - code: Machine-readable error code
                                             - message: Human-readable error message
                                             - field: Optional field name related to error
                                             - meta: Optional contextual metadata
                                             Defaults to None.
        status_code (int): HTTP status code. Defaults to 400 Bad Request.
                          Note: This is for reference, FastAPI will use the actual status_code
                          from the route decorator or exception.
        meta (Dict[str, Any], optional): Additional metadata. Defaults to None.
    
    Returns:
        APIResponse: A standardized response object with success=False.
    
    Example:
        return error_response(
            message="Validation failed",
            errors=[
                ErrorDetail(
                    code="VALIDATION_ERROR",
                    message="Email is required",
                    field="email"
                )
            ],
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
        )
    """
    
    # Create and return an APIResponse object with success=False
    # This ensures all error responses follow the same structure:
    # {
    #   "success": false,
    #   "message": "...",
    #   "data": null,
    #   "errors": [...],
    #   "meta": {...}
    # }
    return APIResponse(
        success=False,          # Indicates the request failed
        message=message,        # Human-readable error message
        data=None,              # No data for error responses
        errors=errors,          # List of detailed error objects
        meta=meta              # Optional metadata
    )


def validation_error_response(
    errors: List[Dict[str, Any]],
    message: str = "Validation failed"
) -> APIResponse:
    """
    Creates a standardized validation error response.
    Helper function to convert validation errors into ErrorDetail format.
    
    Args:
        errors (List[Dict[str, Any]]): List of validation errors in format:
                                      [{"field": "email", "message": "Invalid email"}]
        message (str): Overall error message. Defaults to "Validation failed".
    
    Returns:
        APIResponse: A standardized error response with validation errors.
    
    Example:
        return validation_error_response(
            errors=[
                {"field": "email", "message": "Email is required"},
                {"field": "password", "message": "Password must be at least 8 characters"}
            ]
        )
    """
    
    # Convert dictionary errors to ErrorDetail objects
    # This maps each error dict to an ErrorDetail with:
    # - code: Extracted from error or default "VALIDATION_ERROR"
    # - message: The error message
    # - field: The field name if provided
    error_details = [
        ErrorDetail(
            code=error.get("code", "VALIDATION_ERROR"),  # Machine-readable code
            message=error.get("message", "Validation error"),  # Human-readable message
            field=error.get("field"),  # Optional field name
            meta=error.get("meta")  # Optional metadata
        )
        for error in errors
    ]
    
    # Return error response with the converted ErrorDetail list
    return error_response(
        message=message,
        errors=error_details,
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY  # 422 is standard for validation errors
    )
