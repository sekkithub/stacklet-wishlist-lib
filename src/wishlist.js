/**
 * Component: Wishlist
 * ------------------------------------------------------------------------------
 * A wishlist file that contains scripts to function.
 *
 * @namespace wishlist
 */

import axios from 'axios';
import {on} from '../helpers/utils';

/**
 * DOM selectors.
 */
const selectors = {
  container: '[js-wishlist="container"]',
  list: '[js-wishlist="list"]',
  item: '[js-wishlist="item"]',
  headerIconGroup: '[js-wishlist="header-icon-group"]',
  add: '[js-wishlist="add"]',
  remove: '[js-wishlist="remove"]',
  quickViewBody: '[js-quick-view="body"]',
};

/**
 * Create a new Wishlist object.
 */
export default () => {

  /**
   * DOM node selectors.
   */
  const nodeSelectors = {
    container: document.querySelector(selectors.container),
    list: document.querySelector(selectors.list),
    headerIconGroup: document.querySelector(selectors.headerIconGroup),
    addButtons: [...document.querySelectorAll(selectors.add)],
    quickViewBody: document.querySelector(selectors.quickViewBody),
  };

  /**
   * Add an item to the list
   */
  function addItem(customerId, productId) {
    console.log(`customer ID: ${customerId}`, `product ID: ${productId}`);

    const stackletApiEndpoint = theme.apis.stackletApiEndpoint;

    axios.get(`${stackletApiEndpoint}/api/wishlist/add-product`, {
      params: {
        wishlist: customerId,
        product: productId,
      },
    })
      .then((response) => {
        setHeaderIcon();
        fillHeartIcons();
        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  /**
    * Clear wishlist.
    */
  function removeItemFromList(productId) {
    nodeSelectors.removedItem = nodeSelectors.list.querySelector(`[data-product-id="${productId}"]`);
    nodeSelectors.removedItem.parentNode.removeChild(nodeSelectors.removedItem);
  }

  /**
   * Remove an item from the list
   */
  function removeItem(customerId, productId) {
    console.log(`customer ID: ${customerId}`, `product ID: ${productId}`);

    const stackletApiEndpoint = theme.apis.stackletApiEndpoint;

    axios.get(`${stackletApiEndpoint}/api/wishlist/remove-product`, {
      params: {
        wishlist: customerId,
        product: productId,
      },
    })
      .then((response) => {
        nodeSelectors.list = document.querySelector(selectors.list);

        if (nodeSelectors.list) {
          removeItemFromList(productId);

          if (!isItemInWishlist(nodeSelectors.list)) {
            setNoItemMessage();
          }
        } else {
          fillHeartIcons();
        }

        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  /**
   * Set Header Icon.
   */
  function setHeaderIcon() {
    const stackletApiEndpoint = theme.apis.stackletApiEndpoint;
    const customerId = theme.customer.id;

    axios.get(`${stackletApiEndpoint}/api/wishlist/get-list`, {
      params: {
        wishlist: customerId,
      },
    })
      .then((response) => {
        const totalItems = response.data.resultsCount;

        if (!totalItems || totalItems < 1) {
          nodeSelectors.headerIconGroup.classList.remove('filled');
        } else {
          nodeSelectors.headerIconGroup.classList.add('filled');
        }

        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  /**
   * Filled a heart icon if the item is on Wishlist List.
   */
  function fillHeartIcons() {
    const stackletApiEndpoint = theme.apis.stackletApiEndpoint;
    const customerId = theme.customer.id;

    if (!customerId) {
      return;
    }

    axios.get(`${stackletApiEndpoint}/api/wishlist/get-list`, {
      params: {
        wishlist: customerId,
      },
    })
      .then((response) => {
        const products = response.data.results.data.nodes;
        const productArray = [];

        products.forEach((product) => {
          const productId = product.id.replace(/gid:\/\/shopify\/Product\//g, '');
          productArray.push(productId);
        });

        nodeSelectors.addButtons.forEach((button) => {
          const productId = button.getAttribute('data-product-id');
          if (productArray.indexOf(productId) > -1) {
            button.classList.add('filled');
          } else {
            button.classList.remove('filled');
          }
        });

        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  /**
   * Set Event Listeners.
   */
  function setEventListeners() {
    Frame.EventBus.listen('AjaxCart:itemAdded', (response) => {
      const customerId = theme.customer.id;
      const productId = response.data.product_id;

      if (!customerId && !productId) {
        return;
      }

      removeItem(customerId, productId);
    });
  }

  /**
    * Handle click event on add button.
    */
  function handleAddEvent(event) {
    const target = event.currentTarget;

    if (!target.matches(selectors.add)) {
      return;
    }

    const customerId = theme.customer.id;

    if (!customerId) {
      window.location.href = '/account/login';
      return;
    }

    const productId = target.getAttribute('data-product-id');

    target.classList.add('filled');

    addItem(customerId, productId);
  }

  /**
    * Handle click event on remove button.
    */
  function handleRemoveEvent(event) {
    const target = event.currentTarget;
    const item = target.closest(selectors.item);
    item.classList.add('removing');

    if (!target.matches(selectors.remove)) {
      return;
    }

    const customerId = theme.customer.id;
    const productId = target.getAttribute('data-product-id');

    removeItem(customerId, productId);
  }


  /**
   * Set Event Handlers.
   */
  function setAddEventHandlers() {
    nodeSelectors.addButtons.forEach((element) => {
      on('click', element, (event) => handleAddEvent(event));
    });
  }

  /**
   * Set Event Handlers in Quick View.
   */
  function setAddEventHandlerInQuickView() {
    const add = nodeSelectors.quickViewBody.querySelector(selectors.add);
    on('click', add, (event) => handleAddEvent(event));
  }

  /**
   * Set Event Handlers.
   */
  function setRemoveEventHandlers() {
    nodeSelectors.removeButtons = [...document.querySelectorAll(selectors.remove)];
    nodeSelectors.removeButtons.forEach((element) => {
      on('click', element, (event) => handleRemoveEvent(event));
    });
  }

  /**
    * Set no item message.
    */
  function setNoItemMessage() {
    const div = document.createElement('div');
    nodeSelectors.container.appendChild(div);

    div.innerHTML += `
      <p>
        <span>${theme.strings.noItemMessage}</span>
      </p>
    `;
  }

  /**
    * Check item in Wishlist.
    */
  function isItemInWishlist(list) {
    return list.hasChildNodes();
  }

  /**
   * Construct Wishlist.
   */
  function constructList() {
    if (!nodeSelectors.container) {
      return;
    }

    const customerId = nodeSelectors.container.getAttribute('data-customer-id');
    const stackletApiEndpoint = theme.apis.stackletApiEndpoint;

    axios.get(`${stackletApiEndpoint}/api/wishlist/get-list`, {
      params: {
        wishlist: customerId,
      },
    })
      .then((response) => {
        const products = response.data.results.data.nodes;
        const ul = document.createElement('ul');
        ul.classList.add('card-grid', 'wishlist__list');
        ul.setAttribute('js-wishlist', 'list');
        nodeSelectors.container.appendChild(ul);

        products.forEach((productId) => {
          const id = productId.id.replace(/gid:\/\/shopify\/Product\//g, '');
          const handle = productId.handle;
          const link = `/products/${handle}`;
          const featuredImage = productId.imageS.transformedSrc;
          const title = productId.title;

          const li = document.createElement('li');
          li.setAttribute('data-product-id', id);
          li.setAttribute('js-wishlist', 'item');
          li.classList.add('card-grid__item', 'wishlist__item');
          ul.appendChild(li);
          li.innerHTML += `
            <div class="card card--product wishlist__card">
              <a class="card__link" href="${link}">
                <div class="card__thumbnail-container">
                  <img src="${featuredImage}" class="card__thumbnail-image" />

                  <div
                    class="card__button button button--primary button--block button--small"
                    js-quick-view="toggle" data-product-url="/products/${handle}">
                    Quickview
                  </div>
                </div>
              </a>
          
              <div class="card__footer">
                <a class="card__link" href="${link}">${title}</a><br>
              </div>

              <div
                class="wishlist-button wishlist-button--remove"
                js-wishlist="remove"
                data-product-id="${id}"
                data-customer-id="${customerId}">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon__close" viewBox="0 0 36 36">
                  <path d="M12.51 8.46l-3.17 3.17 1.62 1.62 4 4.08-4 4-1.62 1.55 3.17 3.24 1.62-1.62 4.07-4.07 4.01 4.07 1.55 1.62L27 22.88l-1.62-1.55-4.07-4 4.07-4.08L27 11.63l-3.24-3.17-1.55 1.62-4.01 4.01-4.07-4.01-1.62-1.62z"></path>
                </svg>
              </div>
            </div>
          `;
        });

        setRemoveEventHandlers();

        if (!isItemInWishlist(ul)) {
          setNoItemMessage();
          setHeaderIcon();
        }

        return response;
      })
      .catch((error) => {
        return error;
      });
  }

  /**
   * Initialise component.
   */
  function init() {
    setHeaderIcon();
    fillHeartIcons();
    setEventListeners();
    setAddEventHandlers();
    setRemoveEventHandlers();
    constructList();
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    fillHeartIcons,
    setAddEventHandlerInQuickView,
    init,
  });
};
