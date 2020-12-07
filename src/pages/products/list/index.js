//import ProductForm from "../../../components/product-form";
import SortableTable from "../../../components/sortable-table";
import headerpPoducts from "./products-list-header";
import Router from "../../../router";
import fetchJson from '../../../utils/fetch-json'
import DoubleSlider from "../../../components/double-slider";
export default class Page {
  element;
  subElements = {};
  components = {};



  initEvenListeners (){
    document.addEventListener('click' , this.onItemClick);

    const input = this.element.querySelector('.form-label').nextElementSibling;
    input.addEventListener('input',this.onFilterInput);
    document.addEventListener('pointerup', this.onSliderPointerUp);

    const select = this.element.querySelector('.form-inline').lastElementChild.lastElementChild;
    select.addEventListener('change', this.onStatusChange)

  }
  rerenderPage(data){
    if(!data.length){
      this.renderNoSearchResult();
    }else {
      this.prepareTemplateForNewRequest();
      this.components.sortableTable.updateForProductsPage(data);
    }
  }
  onStatusChange = async (e) =>{
    //this.prepareTemplateForNewRequest();
    this.status = e.target.value;
    const data = await this.updateDataAfterFiltersChanges();
    this.rerenderPage(data);

  }
  onSliderPointerUp = async (e) => {

    if(!e.target.closest('.range-slider__inner')){
      return;
    }
    const sliderElement = this.element.querySelector('.range-slider');
    const leftSpanValue = sliderElement.firstElementChild.innerHTML;
    this.priceStartFilter = this.remove$Sign(leftSpanValue);
    //this.priceStartFilter = this.components.doubleSlider.min;
    const rightSpanValue = sliderElement.lastElementChild.innerHTML;
    this.priceEndFilter = this.remove$Sign(rightSpanValue);
   // this.priceEndFilter = this.components.doubleSlider.max;
    const data =  await this.updateDataAfterFiltersChanges();
    this.rerenderPage(data);
  }

  onFilterInput = async (e) =>{
   // this.prepareTemplateForNewRequest();
    this.nameFilter = e.target.value
    const data =  await this.updateDataAfterFiltersChanges();
    this.rerenderPage(data);
  //TODO пример полного запроса на сервер
    /*
  _embed: subcategory.category
price_gte: 85
price_lte: 4000
title_like: ч
status: 1
_sort: title
_order: asc
_start: 0
_end: 30
   */
  }
  remove$Sign($string){
    const temp = $string.split('');
    const result = [];
    for(let i = 1 ; i< temp.length; i++){
      result.push(temp[i]);
    }
    return result.join('');
  }
  configUrl = () => {
    const url = new URL(`https://course-js.javascript.ru/api/rest/products`);
    url.searchParams.set('_embed', 'subcategory.category');
    url.searchParams.set('price_gte', this.priceStartFilter ? this.priceStartFilter : '0');
    url.searchParams.set('price_lte', this.priceEndFilter ? this.priceEndFilter : '4000');
    if(this.nameFilter){
      url.searchParams.set('title_like', this.nameFilter);
    }
    url.searchParams.set('_sort', 'title');
    if(this.status){
      url.searchParams.set('status', this.status);
    }
    url.searchParams.set('_order', 'asc');
    url.searchParams.set('_start', '0');
    url.searchParams.set('_end', '30');
    return url;
}
  prepareTemplateForNewRequest = () => {
    const sortTable = this.element.querySelector('.sortable-table');
    sortTable.className='sortable-table';
    const emptyPlaceHolder = this.element.querySelector('.sortable-table__empty-placeholder');
    emptyPlaceHolder.innerHTML =``;
  }
  renderNoSearchResult = () => {
    console.log('нет данных для рендеринга')
    const sortTable = this.element.querySelector('.sortable-table');
    sortTable.className='sortable-table sortable-table_empty';
    const emptyPlaceHolder = this.element.querySelector('.sortable-table__empty-placeholder');
    emptyPlaceHolder.innerHTML = `<div>
      <p>Не найдено товаров удовлетворяющих выбранному критерию</p>
      <button  type="button" class="button-primary-outline">Очистить фильтры</button>
    </div>`
    const btn = emptyPlaceHolder.lastElementChild.lastElementChild;
    console.log(btn);

    btn.addEventListener('click', async (e)=>{
      console.log('нажата кнопка сбросить фильтры')
      this.status = null;
      this.priceStartFilter = 0;
      this.priceEndFilter = 4000;
      this.nameFilter= null;
      //Todo сбросить фильтер , спаны, и статус вылью
      const input = this.element.querySelector('.form-label').nextElementSibling.value = ``;
      const sliderElement = this.element.querySelector('.range-slider');
      const leftSpanValue = sliderElement.firstElementChild.innerHTML=`$0`;
      const rightSpanValue = sliderElement.lastElementChild.innerHTML=`$4000`;
      this.components.doubleSlider.max = 4000;
      this.components.doubleSlider.min = 0;
      this.components.doubleSlider.update();
      //TODO сделать новый запрос
      const newurl = this.configUrl();
      const data = await fetchJson(newurl);
      console.log('новые данные')
      console.log(data)
      emptyPlaceHolder.innerHTML = ``;
      sortTable.className = 'sortable-table';
      this.components.sortableTable.updateForProductsPage(data);

    });

  }

   updateDataAfterFiltersChanges = async () =>{
     const url = this.configUrl();
     const data = await fetchJson(url);
     return data;

  }

  onItemClick = event => {
    if(event.target.closest('[data-sortable]')){
      return ;
    }

    if(event.target.closest('.sortable-table__row')){
      const row = event.target.closest('.sortable-table__row')
      if(row.dataset.id){
        Router.instance().navigate(`/products/${row.dataset.id}`);
      }
    }
  }

  async render() {
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    //TODO создать дабл слайдер
    const doubleSlider = new DoubleSlider({
      min:0,
      max:4000,
      formatValue:value => '$' + value,
      selected :{
        from:0,
        to:4000
      }});
    //TODO render слайдера происходит при вызове конструктора
    //TODO добавить к элементу даблСлайдер.
    const doubleSliderContainer = this.element.querySelector('.form-inline').firstElementChild.nextElementSibling
    doubleSliderContainer.append(doubleSlider.element);
    //TODO придумать обработчик событий на каждое взаимодейтсие со слайдером.

    //TODO создание sortableTable и первоначальный запрос
    const sortableTable = new SortableTable(headerpPoducts, {
      url: `api/rest/products?_embed=subcategory.category&_sort=title&_order=asc&_start=0&_end=30}`,
      isSortLocally: true
    });

    //TODO добавить к элементу sortableTable
    this.element.append(sortableTable.element);
    this.components ={
      sortableTable,
      doubleSlider
    }

    //TODO инициализировать листенеры
    this.initEvenListeners()
    return this.element;
  }

  getTemplate() {
    return `
     <div class="products-list">
      <div class="content__top-panel">
        <h1 class="page-title">Товары</h1>
        <a href="/products/add" class="button-primary">Добавить товар</a>
      </div>
      <div class="content-box content-box_small">
        <form class="form-inline">
          <div class="form-group">
            <label class="form-label">Сортировать по:</label>
            <input type="text" data-elem="filterName" class="form-control" placeholder="Название товара">
          </div>
          <div class="form-group" data-elem="sliderContainer">
            <label class="form-label">Цена:</label>

    </div>
          <div class="form-group">
            <label class="form-label">Статус:</label>
            <select class="form-control" data-elem="filterStatus">
              <option value="" selected="">Любой</option>
              <option value="1">Активный</option>
              <option value="0">Неактивный</option>
            </select>
          </div>
        </form>

      </div>
    </div>`
  }

  remove() {
    this.element.remove()
  }

  destroy() {
    document.removeEventListener('pointerup', this.onSliderPointerUp);
    document.removeEventListener('click',this.onItemClick);
    document.removeEventListener('change',this.onStatusChange);
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
