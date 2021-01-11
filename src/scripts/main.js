'use strict'

class ExcepteurOrci {
  constructor() {
    this.init()
    this.setScrollEventsHandler()
    this.setClickEventHandlers()
    this.sendConsoleMessage()
    // this.setReloaderOnResize()
  }

  setVariables() {
    this.EMAIL_VALIDATION_STRING = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    this.CLASS_HIDDEN = 'hidden'
    this.INDICATOR_DISABLE_CLASS_NAME = 'section__indicator--disabled'
    this.TITLE = document.title
    this.BODY_HEIGHT = document.body.offsetHeight
    this.INLINE_MENU_VIEWPORT_WIDTH = 928

    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    // DOM elements
    this.indicators = {
      home: document.querySelector('.home__indicator'),
      ornare: document.querySelectorAll('.ornare__indicator'),
      pharetra: document.querySelector('.pharetra__indicator'),
      laoreet: document.querySelector('.laoreet__indicator')
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
    this.contentButtons = document.querySelectorAll('.content-btn')
    this.ornare = {
      items: {
        containers: document.querySelectorAll('.ornare__item'),
        titles: document.querySelectorAll('.ornare__content-title'),
        descriptions: document.querySelectorAll('.ornare__content-description'),
        illustrations: document.querySelectorAll('.ornare__illustration-img'),
        illustrationDecors: document.querySelectorAll('.ornare__illustration-decor')
      },
      sectionHeight: document.querySelector('.ornare').offsetHeight
    }
    this.pharetra = {
      inputMessages: {
        states: {
          warning: document.querySelector('.pharetra__form-message-warning'),
          sended: document.querySelector('.pharetra__form-message-sended'),
        },
        container: document.querySelector('.pharetra__form-message-container'),
        isActive: false
      },
      container: document.querySelector('.pharetra__content'),
      input: document.querySelector('.pharetra__form-input'),
      submitButton: document.querySelector('.pharetra__submit-btn'),
      placeholder: document.querySelector('.pharetra__form-input-placeholder'),
      contentHeight: document.querySelector('.pharetra__content').offsetHeight,
      formHeight: document.querySelector('.pharetra__form').offsetHeight,
      sectionHeight: document.querySelector('.pharetra').offsetHeight
    }
    this.laoreet = {
      container: document.querySelector('.laoreet'),
      sectionHeight: document.querySelector('.laoreet').offsetHeight
    }
  }

  init() {
    this.setVariables()

    document.querySelector('.main').classList.add(this.isMobile ? 'mobile' : 'desktop')

    if (innerHeight < innerWidth && innerWidth >= this.INLINE_MENU_VIEWPORT_WIDTH) {
      this.nav.itemsContainer.classList.remove('hidden')
    }

    !this.isMobile && this.changeTitle()

    this.setIntroAnimations()
    this.setPharetraInputHandler()
  }

  setIntroAnimations() {
    if (innerHeight < innerWidth && innerWidth >= this.INLINE_MENU_VIEWPORT_WIDTH) {
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
        if (
          pageYOffset >= this.home.sectionHeight + this.ornare.sectionHeight - innerHeight &&
          pageYOffset < this.home.sectionHeight + this.ornare.sectionHeight + this.pharetra.sectionHeight
        ) {
          this.pharetra.container.style.backgroundPositionY = `calc(50% + ${(pageYOffset - (this.home.sectionHeight + this.ornare.sectionHeight)) * .5}px)`
        }
      }

      this.handleSectionAnimations()
    })
  }

  setClickEventHandlers() {

    // navigation
    if (!(innerHeight < innerWidth && innerWidth >= this.INLINE_MENU_VIEWPORT_WIDTH)) {
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

    // content buttons
    this.contentButtons.forEach(button => {
      button.onclick = () => {
        buttonClickHandler()

        function buttonClickHandler() {
          const clickWave = document.createElement('span')
          clickWave.classList.add('content-btn__click-decor')

          button.appendChild(clickWave)
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

    // ornare
    if (
      pageYOffset >= this.ornare.sectionHeight / 3 * .2 &&
      pageYOffset < this.home.sectionHeight + this.ornare.sectionHeight / 3
    ) {
      this.ornare.items.containers[0].classList.remove('ornare__item--disabled')
    } else {
      this.ornare.items.containers[0].classList.add('ornare__item--disabled')
    } if (
      pageYOffset >= this.ornare.sectionHeight / 3 + this.ornare.sectionHeight / 3 * .2 &&
      pageYOffset < this.home.sectionHeight + 2 * this.ornare.sectionHeight / 3
    ) {
      this.ornare.items.containers[1].classList.remove('ornare__item--disabled')
    } else {
      this.ornare.items.containers[1].classList.add('ornare__item--disabled')
    } if (
      pageYOffset >= 2 * this.ornare.sectionHeight / 3 + this.ornare.sectionHeight / 3 * .2 &&
      pageYOffset < this.home.sectionHeight + this.ornare.sectionHeight
    ) {
      this.ornare.items.containers[2].classList.remove('ornare__item--disabled')
    } else {
      this.ornare.items.containers[2].classList.add('ornare__item--disabled')
    }

    // pharetra
    if (
        pageYOffset >= this.home.sectionHeight + this.ornare.sectionHeight - innerHeight * .8 &&
        pageYOffset < this.home.sectionHeight + this.ornare.sectionHeight + this.pharetra.contentHeight
      ) {
      this.pharetra.container.classList.remove('pharetra__content--disabled')
    } else {
      this.pharetra.container.classList.add('pharetra__content--disabled')
    }

    // indicators
    if (pageYOffset < this.home.sectionHeight / 2) {
      this.indicators.home.classList.remove(this.INDICATOR_DISABLE_CLASS_NAME)
    } else {
      this.indicators.home.classList.add(this.INDICATOR_DISABLE_CLASS_NAME)
    } if (
      pageYOffset >= this.home.sectionHeight * .5 &&
      pageYOffset < this.home.sectionHeight * .5 + this.ornare.sectionHeight / 3
    ) {
      this.indicators.ornare[0].classList.remove(this.INDICATOR_DISABLE_CLASS_NAME)
    } else {
      this.indicators.ornare[0].classList.add(this.INDICATOR_DISABLE_CLASS_NAME)
    } if (
      pageYOffset >= this.home.sectionHeight * .5 + this.ornare.sectionHeight / 3 &&
      pageYOffset < this.home.sectionHeight * .5 + this.ornare.sectionHeight * 2 / 3
    ) {
      this.indicators.ornare[1].classList.remove(this.INDICATOR_DISABLE_CLASS_NAME)
    } else {
      this.indicators.ornare[1].classList.add(this.INDICATOR_DISABLE_CLASS_NAME)
    } if (
      pageYOffset >= this.home.sectionHeight * .5 + this.ornare.sectionHeight * 2 / 3 &&
      pageYOffset < this.home.sectionHeight * .5 + this.ornare.sectionHeight
    ) {
      this.indicators.ornare[2].classList.remove(this.INDICATOR_DISABLE_CLASS_NAME)
    } else {
      this.indicators.ornare[2].classList.add(this.INDICATOR_DISABLE_CLASS_NAME)
    } if (
      pageYOffset >= this.home.sectionHeight * .5 + this.ornare.sectionHeight &&
      pageYOffset < this.home.sectionHeight * .5 + this.ornare.sectionHeight + this.pharetra.contentHeight
    ) {
      this.indicators.pharetra.classList.remove(this.INDICATOR_DISABLE_CLASS_NAME)
    } else {
      this.indicators.pharetra.classList.add(this.INDICATOR_DISABLE_CLASS_NAME)
    } if (
      pageYOffset >= this.home.sectionHeight * .5 + this.ornare.sectionHeight + this.pharetra.sectionHeight
    ) {
      this.indicators.laoreet.classList.remove(this.INDICATOR_DISABLE_CLASS_NAME)
    } else {
      this.indicators.laoreet.classList.add(this.INDICATOR_DISABLE_CLASS_NAME)
    }
  }

  changeTitle() {
    const recursion = () => {
      const symbol = '🌲'
      const index = (pageYOffset / (this.BODY_HEIGHT - innerHeight) * (this.TITLE.length / 2) | 0) * 2
      
      let title = this.TITLE.slice(index, this.TITLE.length)
  
      for (let titleIndex = 0; titleIndex < index; titleIndex += 2) {
        title = symbol + title
      }
  
      document.title = title

      requestIdleCallback(recursion)
    }

    recursion()
  }

  sendConsoleMessage() {
    const message = {
      style: 'padding: 5px; color: #fff; background: #1B3732; font-size: 16px;',
      text: 'Hello. All information about the project in README.md file on GitHub.'
    }

    console.log('%c%s', message.style, message.text)
  }

  setReloaderOnResize() {
    const previousWidth = innerWidth
    
    window.onresize = () => innerWidth != previousWidth && location.reload()
  }

  setPharetraInputHandler() {
    let isEmailValid  = false
    let isEmailSended = false

    const inputHandler = () => {
      if (this.pharetra.input.value) {
        this.pharetra.inputMessages.isActive = true
        isEmailValid = this.pharetra.input.value.match(this.EMAIL_VALIDATION_STRING)

        if (!isEmailValid) {
          this.pharetra.inputMessages.states.warning.classList.remove('pharetra__form-message--disabled')
          this.pharetra.inputMessages.container.classList.add('pharetra__form-message-container--active')
        } else {
          this.pharetra.inputMessages.states.warning.classList.add('pharetra__form-message--disabled')
          this.pharetra.inputMessages.container.classList.remove('pharetra__form-message-container--active')
        }
        this.pharetra.placeholder.classList.add('pharetra__form-input-placeholder--disabled')
      } else {
        this.pharetra.inputMessages.states.warning.classList.add('pharetra__form-message--disabled')
        this.pharetra.inputMessages.container.classList.remove('pharetra__form-message-container--active')
        this.pharetra.inputMessages.isActive = false
        isEmailValid = false
        this.pharetra.placeholder.classList.remove('pharetra__form-input-placeholder--disabled')
      }
    }

    const submitHandler = () => {
      if (isEmailValid && !isEmailSended) {
        this.pharetra.inputMessages.container.classList.add('pharetra__form-message-container--active')
        this.pharetra.inputMessages.states.sended.classList.remove('pharetra__form-message--disabled')
        this.pharetra.input.setAttribute('disabled', '')
        isEmailSended = true
      }
    }

    this.pharetra.input.addEventListener('input', inputHandler)
    this.pharetra.submitButton.addEventListener('click', submitHandler)
  }
}

new ExcepteurOrci()
