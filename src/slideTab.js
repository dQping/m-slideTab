!function (global) {
    class SlideTab {
        constructor(el) {
            this.element = el;
            this.init();
        }
        init() {
            this.curDistance = 0;
            this.clickStatus = false;
            this.tabList = this.element.querySelector('.slidetab-list');
            this.tabItems = [...this.element.querySelectorAll('.tabItem')];
            this.maxMoveDistance = this.tabList.offsetWidth - this.element.offsetWidth;
            this.isMobile = !!(window.navigator && window.navigator.userAgent || '').match(/AppleWebKit.*Mobile.*/) || 'ontouchstart' in window.document.documentElement,
            this.movePosition(this.tabList, 0);
            this.attachEvent();
        }

        attachEvent() {
            this.tabItems.forEach((item) => {
                item.addEventListener('click', e => {
                    if (e.target.classList.contains('active')) return;
                    if (e.target.className === 'tabItem') {
                        const offsetLeft = e.target.offsetLeft
                        const liHalfWidth = e.target.offsetWidth / 2;
                        const elHalfWidth = this.element.offsetWidth / 2;
                        let calcdistance = (elHalfWidth - offsetLeft - liHalfWidth).toFixed(2);
                        if (calcdistance > 0) calcdistance = 0;
                        if (-calcdistance > this.maxMoveDistance) calcdistance = - this.maxMoveDistance;
                        this.movePosition(this.tabList, calcdistance);
                        this.curDistance = calcdistance;
                        this.tabItems.forEach((item) => {
                            item.classList.remove('active');
                        });
                        e.target.classList.add('active');
                    }
                })
            })
            this.isMobile ? this.attachTouch() : this.attachDrag();
        }
        attachTouch() {
            let tabList = this.tabList;
            tabList.addEventListener('touchstart', e => {
                this.startX = e.touches[0].clientX;
                this.oldMoveX = this.startX;
            },{ passive: false });
            tabList.addEventListener('touchmove', e => {
                this.moveX = event.touches[0].clientX;
                this.moving()
            },{ passive: false });
            tabList.addEventListener('touchend', e => {
                this.moveEndX = e.changedTouches[0].clientX;
                this.moved();
            },{ passive: false });

        }
        attachDrag() {
            let tabList = this.tabList;
            tabList.addEventListener('mousedown', e => {
                // e.preventDefault();
                this.startX = event.clientX;
                this.oldMoveX = this.startX;
                this.clickStatus = true;
            }, { passive: false });
            tabList.addEventListener('mousemove', e => {
                // e.preventDefault();
                if (this.clickStatus) {
                    this.moveX = event.clientX;
                    this.moving()
                }
            }, { passive: false });
            tabList.addEventListener('mouseup', e => {
                // e.preventDefault()
                this.moveEndX = event.clientX;
                this.moved();
            }, { passive: true });

        };
        moving() {
            this.offset = this.moveX - this.oldMoveX;
            this.curDistance = this.curDistance + this.offset;
            if (-this.curDistance > this.maxMoveDistance) this.curDistance = - this.maxMoveDistance;
            if (this.curDistance > 0) this.curDistance = 0;
            this.movePosition(this.tabList, this.curDistance);
            this.oldMoveX = this.moveX;
        }
        moved() {
            this.offsetSum = this.moveEndX - this.startX;
            this.clickStatus = false;
            if (this.offsetSum == 0) return false;
            this.updateCurDistance(this.tabList);
        }
        updateCurDistance(theSlider) {
            this.curDistance = parseInt(theSlider.style.transform.match(/translate3d\((\-*\d*\.*\d*px)/i)[1]);
        };
        movePosition(theSlider, distance) {
            theSlider.style.webkitTransform = 'translate3d(' + distance + 'px, 0, 0)';
            theSlider.style.transform = 'translate3d(' + distance + 'px, 0, 0)';
        };

    }

    function Plugin(el) {
        let dom = document.querySelector(el);
        if (!dom instanceof HTMLElement) return;
        let slidetab = dom.slidetab;
        // 防止针对同一 dom 元素多次 new 实例
        if (!slidetab) {
            slidetab = dom.slidetab = new SlideTab(dom);
        }
        return slidetab;
    }

    //兼容CommonJs规范
    if (typeof module !== 'undefined' && module.exports) module.exports = Plugin;

    //兼容AMD/CMD规范
    if (typeof define === 'function') define(function () { return Plugin; });

    // 注册全局变量，兼容直接使用script标签引入该插件
    global.slidetab = Plugin;
}(this)
