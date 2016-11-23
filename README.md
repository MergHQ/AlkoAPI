# AlkoAPI
Alko decided to remove their public API for product information, so I quickly made a little application that converts the .txt file with product information and prices they provide to JSON.

# Entrypoint
http://droptable.tk:8080/

________________

# Endpoints

`GET /products` lists all products.

`GET /products/:id` shows one product.

## Response

```
{
  "status": "OK",
  "message": "",
  "data": {}
}

```

### Example response

```
{
  "status": "OK",
  "message": "",
  "data": {
    "id": "000706",
    "name": "Jaloviina *",
    "producer": "Altia",
    "volume": "0,50",
    "price": "15,58"
  }
}

```
