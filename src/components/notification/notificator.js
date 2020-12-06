export default class NotificationMessage {
  static elem = null;

  constructor(message = 'some msg',
              {duration = 1000, type = 'success'} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    //this.show();
  }
  render() {
    const element = document.createElement('div');
    element.innerHTML = `
<div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.message}
      </div>
    </div>
  </div>`;
    this.element = element.firstElementChild;
  }

  show(root = document.body) {

    if (root !== document.body) {
      root.append(this.element);
      return;
    }

    if (!NotificationMessage.elem) {

      this.render();

      NotificationMessage.elem = this.element;
      document.body.append(NotificationMessage.elem);
      setTimeout(()=> {
          this.remove();
        }
        , this.duration);
    }
    else {
      this.element = NotificationMessage.elem;
      this.remove();
      NotificationMessage.elem = null;
      this.show();
    }
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
    //this.element = null;
  }
}
