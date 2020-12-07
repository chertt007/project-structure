
import RangePicker from "../../components/range-picker";
import SortableTable from "../../components/sortable-table";
import headerSales from "./headerSales";
import fetchJson from "../../utils/fetch-json";

const TODAY = new Date();
const PREV_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth()-1, TODAY.getDate())
export default class Page {
  element;
  subElements = {};
  components = {};

  initEventListener(){
    this.components.rangePicker.element.addEventListener('date-select', event => {
      const { from, to } = event.detail;
      this.updateTableComponent(from, to);
    });
  }
  async updateTableComponent (from, to) {
    const data = await fetchJson(`https://course-js.javascript.ru/api/rest/orders?createdAt_gte=${from.toISOString()}&createdAt_lte=${to.toISOString()}&_sort=createdAt&_order=desc&_start=0&_end=30
  `);
    console.log(data)
    this.components.sortableTable.addRows(data);
  }
  async render(){
    const element = document.createElement('div');
    //TODO получить шаблон
    element.innerHTML  =this.getTemplate();
    this.element = element.firstElementChild;
    //TODO добавить ренж пикер - append content__top-panel

    const rangePicker = new RangePicker({from:PREV_MONTH,to:TODAY});
    this.element.querySelector('.content__top-panel').append(rangePicker.element);

    //TODO сделать хедер для сортабл тейбл
    //TODO экспортировать его.
    //TODO создать сорт Тейбл

      const sortableTable  = await new SortableTable(headerSales, {
      url: `api/rest/orders?createdAt_gte=${PREV_MONTH.toISOString()}&createdAt_lte=${TODAY.toISOString()}&_sort=createdAt&_order=desc&_start=0&_end=30`,
      isSortLocally: false
    });

    //TODO заапендить сорт тейбл
    this.element.querySelector('.full-height').append(sortableTable.element);
    //TODO сделать обработчик на выбор даты




    //TODO сорт тейбл в this.components
    //TODO сохранить ренджпикер в this.components
    this.components = {
      rangePicker,
      sortableTable
    }
    this.initEventListener();

    return this.element;
  }
  getTemplate(){
    return`<div class="sales full-height flex-column">
      <div class="content__top-panel">
        <h1 class="page-title">Продажи</h1>

    </div>
      <div data-elem="ordersContainer" class="full-height flex-column">

      </div>
      </div>`
  }

  remove() {
    this.element.remove()
  }

  destroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
