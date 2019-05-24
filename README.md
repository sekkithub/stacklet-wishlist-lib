Setup

Set theme settings schema in settings_schema.json
```
[
  …
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
]
```

Set a message to display when no items on the list, Stacklet App API endpoint and Customer ID in theme-strings.liquid
```
  window.theme = {
    strings: {
    …
      noItemMessage: {{ 'products.product.no_item_message' | t | json }},
    …
    },
    customer: {
      id: {{ customer.id | json }},
    },
    apis: {
      stackletApiEndpoint: {{ settings.stacklet_api_endpoint | json }},
    },
    …
  };

```

Add heart icons in icon-misc.liquid
```
{% case icon %}
  …
  {% when 'heart' %}
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon__heart" viewBox="0 0 36 36">
      <path d="M23.4 7c-2.1 0-4.1 1-5.4 2.5C16.7 8 14.7 7 12.6 7 8.9 7 6 9.9 6 13.6c0 4.5 4.1 8.2 10.3 13.8L18 29l1.7-1.6C25.9 21.8 30 18.1 30 13.6 30 9.9 27.1 7 23.4 7zm-5.3 18.6l-.1.2-.1-.1c-5.7-5.2-9.5-8.6-9.5-12.1 0-2.4 1.8-4.2 4.2-4.2 1.8 0 3.6 1.2 4.3 2.8h2.2c.6-1.6 2.4-2.8 4.3-2.8 2.4 0 4.2 1.8 4.2 4.2 0 3.5-3.8 6.9-9.5 12z"/>
    </svg>

  {% when 'heart-fill' %}
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon__heart" viewBox="0 0 36 36">
      <path d="M23.4 7c-2.1 0-4.1 1-5.4 2.5C16.7 8 14.7 7 12.6 7 8.9 7 6 9.9 6 13.6c0 4.5 4.1 8.2 10.3 13.8L18 29l1.7-1.6C25.9 21.8 30 18.1 30 13.6 30 9.9 27.1 7 23.4 7z"/>
    </svg>
  …
{% endcase %}
```

Insatll

Install Wishlist package via NPM
```
$ yarn add stacklet-wishlist
```

Usage

Create a `page.wishlist.liquid` file in `/src/templates`
```
<div class="template-page__wishlist"
  data-aos="fade" data-aos-duration="700" data-aos-delay="400" data-aos-once="true" class="aos-init aos-animate">
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

Create a `page.wishlist.js` file in `/src/scripts/templates`
```
/**
 * Template: Wishlist
 * -----------------------------------------------------------------------------
 * Scripts to execute on the wishlist page.
 *
 */
import {load} from '@shopify/theme-sections';

import QuickView from '../components/quick-view';

document.addEventListener('DOMContentLoaded', () => {
  load('*');
});

if (theme.features.quickview) {
  QuickView().init();
}
```


Load Wishlist styles in `/src/styles/theme.scss`
```
/*
 * Frame: Theme
 * -----------------------------------------------------------------------------
 * Core entry file for all styling on the theme.
 *
 */
@charset 'UTF-8';

/**
 * Vendors.
 */
@import '~stacklet-wishlist/src/wishlist';
…
```


Init wishlist component after DOM content loaded in theme.js
```
import wishlist from ‘stacklet-wishlist';

document.addEventListener('DOMContentLoaded', () => {
  …
  wishlist().init();
  …
}); ```

Copy `wishlist.liquid` file from ‘/node_modules/stacklet-wishlist/src/snippet.liquid’ and paste it to in `/src/snippets`.

Set Header Icon
```
{% include 'wishlist' with snippet: 'header-icon' %}
```

Set `add to Wishlist` button with the parameters Product ID and Customer ID
```
      {% include 'wishlist' with
        snippet: 'button-add',
        product_id: product.id,
        customer_id: customer.id
      %}
```

Set `Wishlist List` with Customer ID parameter.
```
  {% include 'wishlist' with snippet: 'list', customer_id: customer.id %}
```
