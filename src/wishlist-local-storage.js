/**
 * Component: Local Storage
 * ------------------------------------------------------------------------------
 * A wishlist file that contains scripts to function.
 *
 * @namespace localStorage
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

  const localStorage = window.localStorage;
  let wishlistArray = [];
  let retrievedData;

  function constructLocalStorage() {
    getWishlist();

    if (wishlistArray === null) {
      wishlistArray = [];
    }

    updateNavHeartStatus();
  }

  /**
   * Set Header Icon.
   */
  function updateNavHeartStatus() {
    if (wishlistArray.length) {
      nodeSelectors.navHeartIconGroup.classList.add('is-filled');
    } else {
      nodeSelectors.navHeartIconGroup.classList.remove('is-filled');
    }
  }

  /**
   * Update local storage.
   */
  function updateLocalStorage(array) {
    localStorage.setItem('wishlist', JSON.stringify(array));
  }

  /**
   * Update local storage.
   */
  function removeItem(array, productId) {
    wishlistArray = array.filter((item) => item.id !== productId);
    return wishlistArray;
  }

  /**
   * Update local storage.
   */
  function getWishlist() {
    retrievedData = localStorage.getItem('wishlist');

    if (retrievedData === null) {
      localStorage.setItem('wishlist', JSON.stringify(wishlistArray));
    }

    wishlistArray = JSON.parse(retrievedData);
    return wishlistArray;
  }

  function isProductInArray(arr, id) {
    return arr.some((product) => product.id === id);
  }

  /**
    * Handle click event on add button.
    */
  function handleAddEvent(event) {
    getWishlist();

    const target = event.currentTarget;
    const productId = Number(target.getAttribute('data-product-id'));
    const productHandle = target.getAttribute('data-product-handle');

    const product = {};
    product.id = productId;
    product.handle = productHandle;

    if (target.classList.contains('is-filled')) {
      target.classList.remove('is-filled');
      removeItem(wishlistArray, product.id);
      updateList(product.id);
    } else {

      target.classList.add('is-filled');
      if (!isProductInArray(wishlistArray, product.id)) {
        wishlistArray.push(product);
      }
    }

    updateLocalStorage(wishlistArray);
    updateNavHeartStatus();
    updateAddButtonsHeartStatus();
  }

  /**
   * Filled a heart icon if the item is on Wishlist List.
   */
  function updateAddButtonsHeartStatus() {
    getWishlist();

    nodeSelectors.addButtons.forEach((button) => {
      const productId = Number(button.getAttribute('data-product-id'));

      if (isProductInArray(wishlistArray, productId)) {
        button.classList.add('is-filled');
      } else {
        button.classList.remove('is-filled');
      }
    });
  }

  /**
   * Filled a heart icon if the item is on Wishlist List.
   */
  function updateAddButtonsHeartStatusInQuickview() {
    getWishlist();

    const button = nodeSelectors.quickViewBody.querySelector(selectors.add);
    const productId = Number(button.getAttribute('data-product-id'));

    if (isProductInArray(wishlistArray, productId)) {
      button.classList.add('is-filled');
    } else {
      button.classList.remove('is-filled');
    }
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
    * Update Wishlist.
    */
  function updateList(productId) {
    nodeSelectors.list = document.querySelector(selectors.list);
    if (!nodeSelectors.list) {
      return;
    }

    nodeSelectors.removedItem = nodeSelectors.list.querySelector(`[data-product-id="${productId}"]`);
    nodeSelectors.removedItem.parentNode.removeChild(nodeSelectors.removedItem);
  }

  /**
    * Handle click event on remove button.
    */
  function handleRemoveEvent(event) {

    const target = event.currentTarget;
    const item = target.closest(selectors.item);
    const productId = Number(target.getAttribute('data-product-id'));

    item.classList.add('is-removing');

    removeProduct(productId);
  }

  /**
   * Set Event Handlers.
   */
  function setRemoveEventHandlers(element) {
    on('click', element, (event) => handleRemoveEvent(event));
  }

  /**
   * Remove an item from the list
   */
  function removeProduct(productId) {
    getWishlist();

    wishlistArray = wishlistArray.filter((obj) => {
      return obj.id !== productId;
    });

    updateLocalStorage(wishlistArray);

    updateNavHeartStatus();
    updateAddButtonsHeartStatus();
    updateList(productId);
    setFallbackMessage();
  }

  /**
   * Set Fallback Message.
   */
  function setFallbackMessage() {
    getWishlist();

    if (wishlistArray.length !== 0 || !nodeSelectors.list) {
      return;
    }

    const div = document.createElement('div');
    nodeSelectors.container.appendChild(div);

    div.innerHTML += `
      <span>${theme.strings.noItemMessage}</span>
    `;
  }

  /**
   * Set Event Listeners.
   */
  function setEventListeners() {
    Frame.EventBus.listen('AjaxCart:itemAdded', (response) => {
      const productId = response.data.product_id;
      removeProduct(productId);
    });
  }

  /**
   * Construct Wishlist.
   */
  function constructList() {
    getWishlist();

    const ul = document.createElement('ul');
    ul.classList.add('row', 'wishlist__list');
    ul.setAttribute('js-wishlist', 'list');
    nodeSelectors.loading.parentNode.removeChild(nodeSelectors.loading);
    nodeSelectors.container.appendChild(ul);

    wishlistArray.forEach((product) => {
      axios.get(`/products/${product.handle}.js`)
        .then((response) => {
          const data = response.data;

          const productId = data.id;
          const handle = data.handle;
          const link = `/products/${handle}`;
          const featuredImage = data.images[0];
          const title = data.title;

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
                data-product-id="${productId}">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon__close" viewBox="0 0 36 36">
                  <path d="M12.51 8.46l-3.17 3.17 1.62 1.62 4 4.08-4 4-1.62 1.55 3.17 3.24 1.62-1.62 4.07-4.07 4.01 4.07 1.55 1.62L27 22.88l-1.62-1.55-4.07-4 4.07-4.08L27 11.63l-3.24-3.17-1.55 1.62-4.01 4.01-4.07-4.01-1.62-1.62z"></path>
                </svg>
              </div>
            </div>
          `;

          const removeButton = li.querySelector(selectors.remove);
          setRemoveEventHandlers(removeButton);

          return response;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
    });
  }

  /**
   * Set Wishlist.
   */
  function setList() {
    if (!nodeSelectors.container) {
      return;
    }

    constructList();
    setFallbackMessage();
    updateNavHeartStatus();
  }

  /**
   * Clear local storage.
   */
  function clearProducts() {
    console.log('Cleared localstorage wishlist');

    wishlistArray = [];
    localStorage.setItem('wishlist', JSON.stringify(wishlistArray));
  }

  /**
   * Initialise component.
   */
  function init() {
    constructLocalStorage();
    updateAddButtonsHeartStatus();
    setEventListeners();
    setAddEventHandlers();
    setList();
  }

  /**
   * Expose public interface.
   */
  return Object.freeze({
    updateAddButtonsHeartStatusInQuickview,
    setAddEventHandlerInQuickView,
    getWishlist,
    clearProducts,
    init,
  });
};
