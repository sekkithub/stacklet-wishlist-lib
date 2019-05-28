# Stacklet Wishlist

Wishlist component built with Frame 3.


### Installation

**npm**

```bash
npm install stacklet-wishlist-lib --save
```


**yarn**

```bash
yarn add stacklet-wishlist-lib
```


### Settings

**settings_schema.json**

Set theme settings schema in settings_schema.json

```
[
  ...
  {
    "name": "APIs",
    "settings": [
      {
        "type": "header",
        "content": "Stacklet API Endpoint"
      },
      {
        "type": "text",
        "id": "stacklet_api_endpoint"
      }
    ]
  }
  ...
]
```


**theme-strings.liquid**

Set strings for
* a message to display when no items on the list
* Stacklet App API Endpoint
* Customer ID

```
  window.theme = {
    strings: {
    ...
      noItemMessage: {{ 'products.product.no_item_message' | t | json }},
    ...
    },
    customer: {
      id: {{ customer.id | json }},
    },
    apis: {
      stackletApiEndpoint: {{ settings.stacklet_api_endpoint | json }},
    },
    ...
  };

```


**icon-misc.liquid**

Set heart icons

```liquid
{% case icon %}
  ...
  {% when 'heart' %}
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon__heart" viewBox="0 0 36 36">
      <path d="M23.4 7c-2.1 0-4.1 1-5.4 2.5C16.7 8 14.7 7 12.6 7 8.9 7 6 9.9 6 13.6c0 4.5 4.1 8.2 10.3 13.8L18 29l1.7-1.6C25.9 21.8 30 18.1 30 13.6 30 9.9 27.1 7 23.4 7zm-5.3 18.6l-.1.2-.1-.1c-5.7-5.2-9.5-8.6-9.5-12.1 0-2.4 1.8-4.2 4.2-4.2 1.8 0 3.6 1.2 4.3 2.8h2.2c.6-1.6 2.4-2.8 4.3-2.8 2.4 0 4.2 1.8 4.2 4.2 0 3.5-3.8 6.9-9.5 12z"/>
    </svg>

  {% when 'heart-fill' %}
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon__heart" viewBox="0 0 36 36">
      <path d="M23.4 7c-2.1 0-4.1 1-5.4 2.5C16.7 8 14.7 7 12.6 7 8.9 7 6 9.9 6 13.6c0 4.5 4.1 8.2 10.3 13.8L18 29l1.7-1.6C25.9 21.8 30 18.1 30 13.6 30 9.9 27.1 7 23.4 7z"/>
    </svg>
  ...
{% endcase %}
```


**Snippet**

Copy `wishlist.liquid` file in ‘/node_modules/stacklet-wishlist/src/snippet.liquid’ and
paste it to in `/src/snippets`.


**Header Nav**

Set Wishlist Nav in site header

Example
```
{% include 'wishlist' with snippet: 'header-icon' %}
```


**Add to Wishlist Button**

Put `Add to Wishlist` button with the parameters Product ID and Customer ID where ever needed

Example
```liquid
<div class="card__wishlist-button">
  {% include 'wishlist' with
    snippet: 'button-add',
    product_id: product.id,
    customer_id: customer.id
  %}
</div>
```


### Stylesheet

**/src/styles/theme.scss**

Load Wishlist stylesheet

```scss
  /**
  * Vendors.
  */
  @import '~stacklet-wishlist/src/wishlist';
```


### API Methods Examples

**wishlist.init()**

```js
import wishlist from ‘stacklet-wishlist-lib';

document.addEventListener('DOMContentLoaded', () => {
  wishlist().init();
});
```


**wishlist.addItem()**

```liquid
{% include 'wishlist' with
  snippet: 'button-add',
  product_id: product.id,
  customer_id: customer.id
%}
```

```js
addItem(customerId, productId, callback, target);
```


**wishlist.removeItem()**

Example
```liquid
<div
  class="wishlist-button wishlist-button--remove"
  js-wishlist="remove"
  data-product-id="${productId}"
  data-customer-id="${customerId}">
  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon__close" viewBox="0 0 36 36">
    <path d="M12.51 8.46l-3.17 3.17 1.62 1.62 4 4.08-4 4-1.62 1.55 3.17 3.24 1.62-1.62 4.07-4.07 4.01 4.07 1.55 1.62L27 22.88l-1.62-1.55-4.07-4 4.07-4.08L27 11.63l-3.24-3.17-1.55 1.62-4.01 4.01-4.07-4.01-1.62-1.62z"></path>
  </svg>
</div>
```

```js
removeItem(customerId, productId, callback, target);
```


**wishlist.getList()**

Create a `page.wishlist.liquid` file in `/src/templates`

```liquid
<div class="template-page__wishlist">
  <div class="container">
    <div class="row">
      <div class="col s12">
        <h1>{{ page.title }}</h1>
        <div>
          {% include 'wishlist' with snippet: 'list', customer_id: customer.id %}
        </div>
      </div>
    </div>
  </div>
</div>
```

```js

```


**wishlist.updateAddButtonsHeartStatus()**

```js

```


**wishlist.setAddEventHandlerInQuickView()**

```js

```
