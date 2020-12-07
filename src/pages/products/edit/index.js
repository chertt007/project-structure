import ProductForm from "../../../components/product-form";
import NotificationMessage from "../../../components/notification/notificator";
import Router from "../../../router";

export default class Page {
  element;
  subElements = {};
  components = {};


  initEventListeners(){
    document.addEventListener('product-updated', this.onProductUpdated);
    document.addEventListener('product-saved', this.onProductSaved);

  }
  onProductSaved = event => {
    //TODO сохранить айди
    const form = this.element.querySelector('.form-grid');
    const productId = form.title.value;
    //TODO показать уведомление
    //TODO перейти на страницу редактирования и передать логин в адресную строку для запроса
    Router.instance().navigate(`/products/${productId}`,{prevUrl: window.location.href});
  }
  onProductUpdated = event => {
   // this.showNotification('Товар отредактирован','success' );
    const notificator = new NotificationMessage('товар сохранен',{duration:2000,type:'success'});
    notificator.show();
    const contentBopx = this.element.querySelector('.content-box');
    const form = this.element.querySelector('.form-grid');
    const btnSaveCroods = form.save.getBoundingClientRect();
    notificator.element.style.position = `relative`;
    notificator.element.style.top = btnSaveCroods.y -730 + `px`;
    notificator.element.style.right =1 + `px`;g
    contentBopx.append(notificator.element);
  }
  showNotification = (message,type) => {
    const notificator = new NotificationMessage(message,
      {duration:2000,type:type});
    notificator.show();
    const contentBopx = this.element.querySelector('.content-box');
    const form = this.element.querySelector('.form-grid');
    const btnSaveCroods = form.save.getBoundingClientRect();
    notificator.element.style.position = `fixed`;
    notificator.element.style.top = btnSaveCroods.y -30 + `px`;
    notificator.element.style.right =150 + `px`;
    contentBopx.append(notificator.element)
  }
  async render() {


    this.initEventListeners();
    const element = document.createElement('div');

    //TODO посмотреть текущий адрес строки и сохранить null или id in productId
     const productId = this.getProductId();

    //TODO создать форму. Если в хреф есть содержимое то вставить в конструктор
    const productForm = productId ? new ProductForm(productId) : new ProductForm();
    //TODO придумать как выводить уведомление об успешном добавлении товара по человечески
  /*  if(window.history.state){
      const pathFromWhere = window.history.state.split('/')
      const pathFromWhereForCheck = pathFromWhere[pathFromWhere.length-1];
      if(pathFromWhereForCheck === 'add'){
        this.showNotification('товар успешно сохранен','success');
      }

    }*/


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
    if(history.state){
      const prevUrl = history.state.prevUrl.split('/');
      const lastPart = prevUrl[prevUrl.length-1];
      if(lastPart === 'add'){
        const notificator = new NotificationMessage('товар сохранен',{duration:2000,type:'success'});
        notificator.show();
        const contentBopx = this.element.querySelector('.content-box');
        const form = this.element.querySelector('.form-grid');
        const btnSaveCroods = form.save.getBoundingClientRect();
        notificator.element.style.position = `relative`;
        notificator.element.style.top = btnSaveCroods.y  + `px`;
        notificator.element.style.right =1 + `px`;
        contentBopx.append(notificator.element);

      }
    }
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
  destroy(){
    document.removeEventListener('product-updated', this.onProductUpdated);
    document.removeEventListener('product-saved', this.onProductSaved);
  }
}
