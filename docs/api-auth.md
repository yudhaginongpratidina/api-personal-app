[Back to home](../README.md)

# API AUTH

This API provides authentication and authorization endpoints for user registration, login, and logout.

### REGISTER

Method: 

```
POST
```

Endpoint:

```
/auth/register
```

Request Body:

| Parameter | Type | Required | 
| --- | --- | --- |
| email | string | true | 
| password | string | true |
| confirmPassword | string | true |

Response Body:

| HTTP Code | Code | Message |
| --- | --- | --- |
| 201 | SUCCESS_USER_REGISTERED | User registered successfully |
| 409 | USER_ALREADY_EXISTS | User with this email already exists |


### LOGIN

Method:

```
POST
```

Endpoint:

```
/auth/login
```

Request Body:

| Parameter | Type | Required |
| --- | --- | --- |
| email | string | true |
| password | string | true |

Response Body:

| HTTP Code | Code | Message |
| --- | --- | --- |
| 200 | SUCCESS_USER_LOGGED_IN | User logged in successfully |
| 401 | INVALID_CREDENTIALS | Invalid email or password |

### LOGOUT

Method:

```
POST
```

Endpoint:

```
/auth/logout
```

Response Body:

| HTTP Code | Code | Message |
| --- | --- | --- |
| 200 | SUCCESS_USER_LOGGED_OUT | User logged out successfully |
| 401 | USER_NOT_LOGGED_IN | User is not logged in |

[Back to home](../README.md)