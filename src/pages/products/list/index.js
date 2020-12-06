//import ProductForm from "../../../components/product-form";
import SortableTable from "../../../components/sortable-table";
import headerpPoducts from "./products-list-header";
import Router from "../../../router";
import fetchJson from '../../../utils/fetch-json'
export default class Page {
  element;
  subElements = {};
  components = {};



  initEvenListeners (){
    document.addEventListener('click' , this.onItemClick);

    const input = this.element.querySelector('.form-label').nextElementSibling;
    input.addEventListener('input',this.onFilterInput);

  }
  onFilterInput = async (e) =>{
    console.log(e.target.value)
    const url = new URL(`https://course-js.javascript.ru/api/rest/products`);
    url.searchParams.set('_embed', 'subcategory.category');
    url.searchParams.set('price_gte', '0');
    url.searchParams.set('price_lte', '4000');
    url.searchParams.set('title_like', `${e.target.value}`);
    url.searchParams.set('_sort', 'title');
    url.searchParams.set('_order', 'asc');
    url.searchParams.set('_start', '0');
    url.searchParams.set('_end', '30');
    const data = await fetchJson(url);
    console.log(data);
    this.components.sortableTable.updateForProductsPage(data);

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

    //TODO создание sortableTable и первоначальный запрос
    const sortableTable = new SortableTable(headerpPoducts, {
      url: `api/rest/products?_embed=subcategory.category&_sort=title&_order=asc&_start=0&_end=30}`,
      isSortLocally: false
    });


    this.element.append(sortableTable.element);
    this.components ={
      sortableTable
    }

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
          <div class="range-slider">
      <span data-elem="from">$0</span>
      <div data-elem="inner" class="range-slider__inner">
        <span data-elem="progress" class="range-slider__progress" style="left: 0%; right: 0%;"></span>
        <span data-elem="thumbLeft" class="range-slider__thumb-left" style="left: 0%;"></span>
        <span data-elem="thumbRight" class="range-slider__thumb-right" style="right: 0%;"></span>
      </div>
      <span data-elem="to">$4000</span>
    </div></div>
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
  }

  destroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
