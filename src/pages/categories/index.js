import fetchJson from '../../utils/fetch-json'
import SortableList from "../../components/sortable-list";
import NotificationMessage from "../../components/notification/notificator";
export default class Page {

  element;
  subElements = {};
  components = {};
  componentsArr = [];

  initEventListener(){
    document.addEventListener('sortable-list-reorder', this.onOrderChanged);
  }
  onOrderChanged = ( event ) => {
    const wrapper = this.element.querySelector('.content__top-panel').nextElementSibling;
    const croods = wrapper.getBoundingClientRect();
    const notificator = new NotificationMessage('Категория перемещена',{
      duration:2000,
      type:'success'
    });
    notificator.show();
    notificator.element.style.position = 'relative';
    notificator.element.style.top = croods.y  + 'px';
    notificator.element.style.left  =croods.x + 'px';
    wrapper.append(notificator.element);


  }

  async render(){
    this.initEventListener();
    const element = document.createElement('div');

    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    //TODO сделать запрос и исходя из инфы запроса - количества групп айтемов создавать Лист
    const data = await fetchJson(`https://course-js.javascript.ru/api/rest/categories?_sort=weight&_refs=subcategory`);

    //Todo data это массив из объектов.
    // по каждому объекту и в this.element заапендить шаблоны для листа
    this.appendSortableListsCotnatiners(data);
    //todo дальше из зис элемента querySelectorAll('.subcategory-list')
    const containersArray = this.element.querySelectorAll('.subcategory-list');
    //todo пройтись по полученному массиву и в каждом создать конструктор и пихнуть туда
    //todo соответствующий айтем.


    for (let i =0; i<data.length;i++){
      const {subcategories} = data[i];
      const liArr = [];
      subcategories.forEach(el => {
        const li = document.createElement('li');
        li.classList = 'categories__sortable-list-item';
        li.dataset.id = el.id;
        li.dataset.grabHandle='';
        li.style = '';
        li.innerHTML = `<strong>${el.title}</strong>
        <span><b>${el.count}</b> products</span>`
        liArr.push(li);
      });
      const currSortableList = new SortableList({items:liArr});
      this.componentsArr.push(currSortableList);
      containersArray[i].append(currSortableList.element);

    }
    return this.element
  }
  appendSortableListsCotnatiners(data){
    //Todo data это массив из объектов.
    // по каждому объекту и в this.element заапендить шаблоны для листа
    data.forEach(el => {
      this.element.firstElementChild.nextElementSibling.insertAdjacentHTML("beforeend",
        ` <div class="category category_open" data-id="${el.id}">
      <header class="category__header ">
      ${el.title}
      </header>
      <div class="category__body">
        <div class="subcategory-list"></div>
      </div>
     </div>`)
    });

  }
  getTemplate() {
    return`<div class="categories">
      <div class="content__top-panel">
        <h1 class="page-title">Категории товаров</h1>
      </div>

      <div data-elem="categoriesContainer">

     </div>
      </div>`
  }

  remove(){this.element.remove();}
  destroy(){
    this.componentsArr.forEach(el => el.destroy());
  }
}
