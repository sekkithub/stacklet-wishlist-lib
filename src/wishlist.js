/**
 * Component: Wishlist
 * ------------------------------------------------------------------------------
 * A wishlist file that contains scripts to function.
 *
 * @namespace wishlist
 */

import axios from 'axios';
import {on} from './utils';

/**
 * DOM selectors.
 */
const selectors = {
  container: '[js-wishlist="container"]',
  loading: '[js-wishlist="loading"]',
  list: '[js-wishlist="list"]',
  item: '[js-wishlist="item"]',
  navHeartIconGroup: '[js-wishlist="nav-heart-icon-group"]',
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
    loading: document.querySelector(selectors.loading),
    navHeartIconGroup: document.querySelector(selectors.navHeartIconGroup),
    addButtons: [...document.querySelectorAll(selectors.add)],
    quickViewBody: document.querySelector(selectors.quickViewBody),
  };

  /**
   * Add an item to the list
   */

  function addItem(customerId, productId, callback, target) {
    const stackletApiEndpoint = theme.apis.stackletApiEndpoint;

    axios.get(`${stackletApiEndpoint}/api/wishlist/add-product`, {
      params: {
        wishlist: customerId,
        product: productId,
      },
    })
      .then((response) => {
        console.log('Added to wishlist', {
          customerId: customerId,
          productId: productId,
        });
        
        callback(target);
        return response;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  /**
    * Update Wishlist.
    */
  function updateList(productId) {
    nodeSelectors.list = document.querySelector(selectors.list);
    if(!nodeSelectors.list) {
      return;
    }

    nodeSelectors.removedItem = nodeSelectors.list.querySelector(`[data-product-id="${productId}"]`);
    nodeSelectors.removedItem.parentNode.removeChild(nodeSelectors.removedItem);
  }

  /**
   * Remove an item from the list
   */
  function removeItem(customerId, productId, callback, target) {
    const stackletApiEndpoint = theme.apis.stackletApiEndpoint;

    axios.get(`${stackletApiEndpoint}/api/wishlist/remove-product`, {
      params: {
        wishlist: customerId,
        product: productId,
      },
    })
      .then((response) => {
        console.log('Removed from wishlist', {
          customerId: customerId,
          productId: productId,
        });

        callback(target);
        return response;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  /**
   * Get a Wishlist data
   */
  function getList(customerId, callback) {
    const stackletApiEndpoint = theme.apis.stackletApiEndpoint;
    axios.get(`${stackletApiEndpoint}/api/wishlist/get-list`, {
      params: {
        wishlist: customerId,
      },
    })
      .then((response) => {
        callback(response, customerId);
        return response;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }


  /**
   * Set Header Icon.
   */
  function updateNavHeartStatus() {
    const customerId = theme.customer.id;
    getList(customerId, (response) => {
      const totalItems = response.data.resultsCount;
      if (!totalItems || totalItems < 1) {
        nodeSelectors.navHeartIconGroup.classList.remove('is-filled');
      } else {
        nodeSelectors.navHeartIconGroup.classList.add('is-filled');
      }
    });
  }

  /**
   * Filled a heart icon if the item is on Wishlist List.
   */
  function updateAddButtonsHeartStatus() {
    const customerId = theme.customer.id;

    if (!customerId) {
      return;
    }

    getList(customerId, (response) => {
      const products = response.data.results.data.nodes;
      const productArray = [];

      products.forEach((product) => {
        const productId = Number(product.id.replace(/gid:\/\/shopify\/Product\//g, ''));
        productArray.push(productId);
      });

      nodeSelectors.addButtons.forEach((button) => {
        const productId = Number(button.getAttribute('data-product-id'));
        if (productArray.indexOf(productId) > -1) {
          button.classList.add('is-filled');
        } else {
          button.classList.remove('is-filled');
        }
      });
    });
  }

  /**
   * Set Fallback Message.
   */
  function setFallbackMessage() {
    nodeSelectors.list = document.querySelector(selectors.list);
    if (isItemInWishlist(nodeSelectors.list)) {
      return;
    }

    showFallbackMessage();
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

      removeItem(customerId, productId, () => {
        updateNavHeartStatus();
        updateAddButtonsHeartStatus();
        updateList(productId);
        setFallbackMessage();
      });
    });
  }

  /**
    * Lock a button.
    */
  function lockButton(button) {
    button.classList.add('is-locked');
  }

  /**
    * Unlock a button.
    */
  function unlockButton(button) {
    button.classList.remove('is-locked');
  }

  /**
    * Handle click event on add button.
    */
  function handleAddEvent(event) {
    const target = event.currentTarget;
    const customerId = theme.customer.id;
    const productId = Number(target.getAttribute('data-product-id'));

    lockButton(target);

    if (!customerId) {
      window.location.href = '/account/login';
      return;
    }

    if (target.classList.contains('is-filled')) {
      target.classList.remove('is-filled');
      removeItem(customerId, productId, (target) => {
        updateNavHeartStatus();
        unlockButton(target);
      }, target);
    } else {
      target.classList.add('is-filled');
      addItem(customerId, productId, (target) => {
        updateNavHeartStatus();
        updateAddButtonsHeartStatus();
        unlockButton(target);
      }, target);
    }
  }

  /**
    * Handle click event on remove button.
    */
  function handleRemoveEvent(event) {
    const target = event.currentTarget;
    const item = target.closest(selectors.item);
    const customerId = theme.customer.id;
    const productId = Number(target.getAttribute('data-product-id'));

    lockButton(target);
    item.classList.add('is-removing');

    if (!target.matches(selectors.remove)) {
      return;
    }

    removeItem(customerId, productId, () => {
      updateNavHeartStatus();
      updateList(productId);
      setFallbackMessage();
    }, target);
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
    const button = nodeSelectors.quickViewBody.querySelector(selectors.add);
    on('click', button, (event) => handleAddEvent(event));
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
  function showFallbackMessage() {
    const div = document.createElement('div');
    nodeSelectors.container.appendChild(div);

    div.innerHTML += `
      <span>${theme.strings.noItemMessage}</span>
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
  function constructList(response, customerId) {
    const products = response.data.results.data.nodes;
    const ul = document.createElement('ul');
    ul.classList.add('row', 'wishlist__list');
    ul.setAttribute('js-wishlist', 'list');
    nodeSelectors.loading.parentNode.removeChild(nodeSelectors.loading);
    nodeSelectors.container.appendChild(ul);

    products.forEach((product) => {

      const id = product.id.replace(/gid:\/\/shopify\/Product\//g, '');
      const productId = Number(id);
      const handle = product.handle;
      const link = `/products/${handle}`;
      const featuredImage = product.imageS.transformedSrc;
      const title = product.title;

      const li = document.createElement('li');
      li.setAttribute('data-product-id', productId);
      li.setAttribute('js-wishlist', 'item');
      li.classList.add('col', 's6', 'm4', 'l3', 'wishlist__item');
      ul.appendChild(li);
      li.innerHTML += `
        <div class="wishlist-card">
          <a href="${link}">
            <div class="wishlist-card__thumbnail-container">
              <img src="${featuredImage}" class="wishlist-card__thumbnail-image" />

              <div
                class="button button--primary button--block button--small wishlist-card__button"
                js-quick-view="toggle"
                data-product-url="/products/${handle}">
                Quickview
              </div>
            </div>
          </a>
      
          <div class="wishlist-card__footer">
            <a class="wishlist-card__link" href="${link}">
              ${title}
            </a>
          </div>

          <div
            class="wishlist-button wishlist-button--remove"
            js-wishlist="remove"
            data-product-id="${productId}"
            data-customer-id="${customerId}">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon__close" viewBox="0 0 36 36">
              <path d="M12.51 8.46l-3.17 3.17 1.62 1.62 4 4.08-4 4-1.62 1.55 3.17 3.24 1.62-1.62 4.07-4.07 4.01 4.07 1.55 1.62L27 22.88l-1.62-1.55-4.07-4 4.07-4.08L27 11.63l-3.24-3.17-1.55 1.62-4.01 4.01-4.07-4.01-1.62-1.62z"></path>
            </svg>
          </div>
        </div>
      `;
    });
  }

  /**
   * Set Wishlist.
   */
  function setList() {
    if (!nodeSelectors.container) {
      return;
    }

    const customerId = theme.customer.id;

    getList(customerId, (response, customerId) => {
      constructList(response, customerId);
      setRemoveEventHandlers();

      setFallbackMessage();
      updateNavHeartStatus();
    });
  }

  /**
   * Initialise component.
   */
  function init() {
    updateNavHeartStatus();
    updateAddButtonsHeartStatus();
    setEventListeners();
    setAddEventHandlers();
    setList();
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    updateAddButtonsHeartStatus,
    setAddEventHandlerInQuickView,
    addItem,
    removeItem,
    getList,
    init,
  });
};
