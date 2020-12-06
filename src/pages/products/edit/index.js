import ProductForm from "../../../components/product-form";
import NotificationMessage from "../../../components/notification/notificator";

export default class Page {
  element;
  subElements = {};
  components = {};


  initEventListeners(){
    document.addEventListener('product-updated', this.onProductUpdated);
    document.addEventListener('product-saved', this.onProductSaved);
  }
  onProductSaved = event => {
    console.log('saved')
  }
  onProductUpdated = event => {
    console.log('updated')

  }
  async render() {
    const element = document.createElement('div');

    //TODO посмотреть текущий адрес строки и сохранить null или id in productId
     const productId = this.getProductId();

    //TODO создать форму. Если в хреф есть содержимое то вставить в конструктор
    const productForm = productId ? new ProductForm(productId) : new ProductForm();


    //TODO сохранить форму в this.components.productForm;
    this.components = {
      productForm,
    }


    //TODO создаем тимплейт, который опирается на данные созданной формы.
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    //TODO в  <div class="content-box"> добавить форму asyncr Form.render()
    const contentBox = this.element.querySelector('.content-box');
    const renderedForm = await this.components.productForm.render();
    contentBox.append(renderedForm);
    const elem = document.createElement('div');

    return this.element;
  }

  getTemplate(){
    return`<div class='products-edit'>
            <div class="content__top-panel">
        <h1 class="page-title">
          <a href="/products" class="link">Товары</a> / ${this.components.productForm.productId ? `Редактировать` : `Добавить` }
        </h1>
      </div>
      <div class="content-box">

</div>
</div>`
  }
  getProductId(){
    const splittedPath = window.location.href.split('/');
    let productId = splittedPath[splittedPath.length-1];
    if(productId === 'add'){
      productId = null;
    };
    return productId;
  }
  remove(){}
  destroy(){}
}
