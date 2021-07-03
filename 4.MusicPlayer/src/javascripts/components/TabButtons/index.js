/**
 * 태그와 클래스명만을 판단하는 함수입니다. 아이디 등 나머지는 현재 지원하지 않습니다.
 */
const getClosestElementByClassName = (element, selector) => {
    let evaluate = false; 
    if (/^\./.test(selector)) {
        evaluate = element.classList.contains(selector);
    } else {
        evaluate = element.tagName === selector.toUpperCase();
    }

    if (evaluate) {
        return element;
    }

    return getClosestElementByClassName(element.parentElement, selector);
}

export default class TabButtons {

    constructor() {
        this.renderElement = TabButtons.createRenderElement();
        this.bindEvents();
    }

    static createRenderElement() {
        const tabsContainer = document.createElement('UL');
        tabsContainer.classList.add('app-controller');
        const tabs = [
            { title: 'Top5', iconName: 'icon-top5' },
            { title: 'Playlist', iconName: 'icon-playlist' },
            { title: 'Search', iconName: 'icon-search' },
        ];

        tabsContainer.innerHTML = tabs.map(tab => {
            return `
                <li>
                    <button class="button-app-controller">
                        <i class="tab-icon ${tab.iconName}"></i>
                        ${tab.title}
                    </button>
                </li>
            `;
        }).join('');

        return tabsContainer;
    }

    bindEvents() {
        this.renderElement.addEventListener('click', (event) => {
            const element = getClosestElementByClassName(event.target, 'li');
            const listItems = element.parentElement.querySelectorAll('li');
            const currentIndex = Array.prototype.slice.call(listItems).findIndex(listItem => listItem === element);
            this.emit('clickTab', { currentIndex });
        })
    }

    /**
     * 이벤트를 등록해주는 도구를 답니다.
     * 상속받는 것도 좋지만, 컴포넌트 클래스를 따로 만들어서 하는 것까지 나가기는 좀 그렇기 때문에
     * 몇개 되지 않으니 각 클래스에 그냥 달도록 하겠습니다.
     */
     on(eventName, callback) {
        this.events = this.events ? this.events : {};
        this.events[eventName] = callback;
    }

    emit(eventName, payload) {
        this.events[eventName](payload);
    }

    render() {
        return this.renderElement;
    }
}