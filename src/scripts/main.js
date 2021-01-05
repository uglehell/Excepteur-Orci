
'use strict'

class ExcepteurOrci {
  constructor() {
    this.init()
    this.setScrollEventsHandler()
    this.setClickEventHandlers()
    this.sendConsoleMessage()
  }

  setVariables() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.isMobile = true
    } else {
      this.isMobile = false
    }

    this.EMAIL_VALIDATION_STRING = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    this.CLASS_HIDDEN = 'hidden'
    this.INDICATOR_DISABLE_CLASS_NAME = 'section__indicator--disabled'
    this.TITLE = document.title
    this.INLINE_MENU_VIEWPORT_WIDTH = 928

    this.indicators = {
      home: document.querySelector('.home__indicator')
    }
    this.nav = {
      button: document.querySelector('.nav-btn'),
      itemsContainer: document.querySelector('.nav__links-list'),
      items: document.querySelectorAll('.nav__item-link-btn'),
      isActive: false,
      stateClassNames: {
        button: 'nav-btn--active',
        itemsContainer: 'nav__links-list--active'
      }
    }
    this.home = {
      container: document.querySelector('.home'),
      links: document.querySelectorAll('.home__social-link'),
      inscriptions: document.querySelector('.home__inscriptions'),
      title: document.querySelector('.home__title'),
      description: document.querySelector('.home__description'),
      sectionHeight: innerHeight
    }
  }

  init() {
    this.setVariables()

    document.querySelector('.main').classList.add(this.isMobile ? 'mobile' : 'desktop')

    if (innerHeight < innerWidth && innerWidth >= this.INLINE_MENU_VIEWPORT_WIDTH) {
      this.nav.itemsContainer.classList.remove('hidden')
    }

    this.setIntroAnimations()
  }

  setIntroAnimations() {
    if (innerHeight >= innerWidth && innerWidth >= this.INLINE_MENU_VIEWPORT_WIDTH) {
      this.handleSectionAnimations()
    } else {
      setTimeout(() => this.handleSectionAnimations(), 500)
      this.playHamburgerMenuAppearance()
    }
  }

  playHamburgerMenuAppearance() {
    setTimeout(() => this.nav.button.classList.remove('nav-btn--disabled'), 100)
  }

  setScrollEventsHandler() {
    window.addEventListener('scroll', event => {
      if (!this.isMobile) {
        if (pageYOffset < innerHeight) {
          this.home.container.style.backgroundPositionY = `calc(50% - ${pageYOffset * .5}px)`
          this.home.inscriptions.style.transform = `translateY(${-pageYOffset * .4}px) translate(-50%, -50%)`
        }
      }

      this.handleSectionAnimations()
    })
  }

  setClickEventHandlers() {

    // navigation
    if (innerHeight >= innerWidth && innerWidth >= 320) {
      this.nav.button.onclick = () => {
        this.nav.isActive = !this.nav.isActive
  
        if (this.nav.isActive) {
          setTimeout(() => this.nav.itemsContainer.classList.add(this.nav.stateClassNames.itemsContainer), 10)
          this.nav.button.classList.add(this.nav.stateClassNames.button)
          this.nav.itemsContainer.classList.remove(this.CLASS_HIDDEN)
        } else {
          this.nav.itemsContainer.classList.remove(this.nav.stateClassNames.itemsContainer)
          this.nav.button.classList.remove(this.nav.stateClassNames.button)
          setTimeout(() => {
            if (!this.nav.isActive) {
              this.nav.itemsContainer.classList.add(this.CLASS_HIDDEN)
            }
          }, 500)
        }
      }
      this.nav.items.forEach(item => {
        item.onclick = () => {
          this.nav.isActive = false
  
          this.nav.itemsContainer.classList.remove(this.nav.stateClassNames.itemsContainer)
          this.nav.button.classList.remove(this.nav.stateClassNames.button)
          setTimeout(() => {
            if (!this.nav.isActive) {
              this.nav.itemsContainer.classList.add(this.CLASS_HIDDEN)
            }
          }, 500)
        }
      })
    }

    // home links
    this.home.links.forEach(link => {
      link.onclick = () => {
        linkClickHandler()

        function linkClickHandler() {
          const clickWave = document.createElement('span')
          clickWave.classList.add('home__social-click-decor')

          link.appendChild(clickWave)
          setTimeout(() => clickWave.remove(), 800)
        }
      }
    })
  }

  handleSectionAnimations() {

    // home
    if (pageYOffset < this.home.sectionHeight * .8) {
      this.home.container.classList.remove('home--disabled')
    } else {
      this.home.container.classList.add('home--disabled')
    }

    // indicators
    for (let indicator in this.indicators) {
      if (!this.indicators[indicator].classList.contains(this.INDICATOR_DISABLE_CLASS_NAME)){
        this.indicators[indicator].classList.add(this.INDICATOR_DISABLE_CLASS_NAME)
      }
    }
    if (pageYOffset <= innerHeight / 2) {
      if (this.indicators.home.classList.contains(this.INDICATOR_DISABLE_CLASS_NAME)) {
        this.indicators.home.classList.remove(this.INDICATOR_DISABLE_CLASS_NAME)
      }
    }
  }

  changeTitle() {
    const title = this.TITLE // 🌲

    document.title = title
  }

  sendConsoleMessage() {
    const message = {
      style: 'padding: 10px; color: #fff; background: #072E2C; font-size: 16px;',
      text: 'Hello. If you want the site to display correctly reload the page for each resolution. Thanks'
    }

    console.log('%c%s', message.style, message.text)
  }
}

new ExcepteurOrci()

// reload on resize (delete in production)
let previousWidth = innerWidth

window.onresize = () => innerWidth != previousWidth && location.reload()
