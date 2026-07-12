from fastapi import Request
from jose import jwt, JWTError
from slowapi import Limiter 
from slowapi.util import get_remote_address

from app.core.security import SECRET_KEY, ALGORITHM 

# For 'bucketing': 
# for instance, redis stores a request made by user:42 and 203.0.113.7.
# Redis does not know that it belongs to the same user.
# rate_limit_key creates the key(string) so that the same user's bucket is updated and no duplicates exists. 
def rate_limit_key(request: Request) -> str:
    auth = request.headers.get("authorization", "")
    if auth.lower().startswith("bearer"):
        try:
            payload = jwt.decode(auth[7:], SECRET_KEY, algorithms=[ALGORITHM] )
            if (user_id := payload.get("sub")) is not None: 
                return f"user:{user_id}"
        except JWTError:
            pass
    return get_remote_address(request)

limiter = Limiter(key_func=rate_limit_key)