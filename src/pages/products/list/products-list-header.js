import noImg from '../../../assets/images/No_Image_Available.jpg'
const headerpPoducts = [
  {
    id: 'images',
    title: 'Image',
    sortable: false,
    template: data => {
      if(data[0]){
        if(data[0].url){
          return `
          <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="${data[0].url}">
          </div>
        `;
        }
      }else {
        return `<div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="${noImg}">
          </div>`
      }

    }
  },
  {
    id: 'title',
    title: 'Name',
    sortable: true,
    sortType: 'string'
  },

  {
    id: 'quantity',
    title: 'Quantity',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'price',
    title: 'Price',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'status',
    title: 'Status',
    sortable: true,
    sortType: 'number',
    template: data => {
      return `<div class="sortable-table__cell">
          ${data > 0 ? 'Active' : 'Inactive'}
        </div>`;
    }
  },
];

export default headerpPoducts;
