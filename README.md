# Stacklet Wishlist

Wishlist component built with Frame 3.


### Installation

**yarn**

```bash
yarn add stacklet-wishlist-lib
```


### Settings

**Setting Schema**

Set theme settings schema

settings_schema.json
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


**Theme Strings**

Set strings for
* a message to display when no items on the list
* Stacklet App API Endpoint
* Customer ID

theme-strings.liquid
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


### Stylesheet

**Load stylesheet**

Load Wishlist stylesheet

/src/styles/theme.scss
```scss
  /**
  * Vendors.
  */
  @import '~stacklet-wishlist/src/wishlist';
```


### Liquid Files

**SVG icons**

Set heart icons

icon-misc.liquid
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

site-header.liquid
```
<div class="site-header__icon">
  {% include 'wishlist' with snippet: 'header-icon' %}
</div>
```


**Add to Wishlist Button**

Put `Add to Wishlist` button with the parameters Product ID and Customer ID where ever needed

Example product-card.liquid
```liquid
<div class="card__wishlist-button">
  {% include 'wishlist' with
    snippet: 'button-add',
    product_id: product.id,
    customer_id: customer.id
  %}
</div>
```


**Remove from Wishlist Button**

Put `Remove from Wishlist` button with the parameters Product ID and Customer ID where ever needed

Example liquid
```liquid
<div
  class="wishlist-button wishlist-button--remove"
  js-wishlist="remove"
  data-product-id="${productId}"
  data-customer-id="${customerId}"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon__close" viewBox="0 0 36 36">
    <path d="M12.51 8.46l-3.17 3.17 1.62 1.62 4 4.08-4 4-1.62 1.55 3.17 3.24 1.62-1.62 4.07-4.07 4.01 4.07 1.55 1.62L27 22.88l-1.62-1.55-4.07-4 4.07-4.08L27 11.63l-3.24-3.17-1.55 1.62-4.01 4.01-4.07-4.01-1.62-1.62z"></path>
  </svg>
</div>
```


**Set Wishlist page and list**

Create a `page.wishlist.liquid` file in `/src/templates`

page.wishlist.liquid
```liquid
<div class="template-page__wishlist">
  <div class="container">
    <div class="row">
      <div class="col s12">
        <h1>{{ page.title }}</h1>
        <div>
          {% include 'wishlist' with
            snippet: 'list',
            customer_id: customer.id
          %}
        </div>
      </div>
    </div>
  </div>
</div>
```


### Usage

**init()**

```js
import wishlist from ‘stacklet-wishlist-lib';

document.addEventListener('DOMContentLoaded', () => {
  ...
  wishlist().init();
  ...
});
```


### API Methods

**addProduct()**

```js
/**
 * @param {String} customerId - Customer ID
 * @param {String} productId - Product ID needed to add
 * @param {Function} callback - The callback to run on the event.
 * @param {Node} target - The element to disable click event during the callback.
 */
addProduct(customerId, productId, callback, target);
```


**removeProduct()**

```js
/**
 * @param {String} customerId - Customer ID
 * @param {String} productId - Product ID needed to add
 * @param {Function} callback - The callback to run on the event.
 * @param {Node} target - The element to disable click event during the callback.
 */
removeProduct(customerId, productId, callback, target);
```


**getList()**

```js
/**
 * @param {String} customerId - Customer ID
 * @param {Function} callback - The callback to run on the event.
 */
getList(customerId, callback);
```
