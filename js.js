if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js')
}

class TaskController {
  constructor (options = {}) {
    this.elText = options.elApp || document.querySelector('#text')
    this.elRevert = options.elRevert || document.querySelector('#revert')
    this.elMessage = options.elMessage || document.querySelector('#message')
    this.initialData = {}
  }

  start () {
    this.load()
    this.showMessage('READY')

    this.elText.addEventListener('input', (event) => {
      this.save()
    })

    this.elRevert.addEventListener('click', (event) => {
      if (confirm('Are you sure you want to discard your changes?')) {
        this.revert()
      }
    })
  }

  save () {
    const text = this.elText.value
    this.saveData({ text })
  }

  saveData ({ text }) {
    this.showMessage('SAVING')

    const data = { text }
    const json = JSON.stringify(data)
    localStorage.setItem('mypwa-data', json)

    setTimeout(() => {
      this.showMessage('SAVED')
    }, 300)
  }

  load () {
    const json = localStorage.getItem('mypwa-data')
    const data = JSON.parse(json) || {}
    this.elText.value = data.text || ''

    for (const p in data) {
      if (data.hasOwnProperty(p)) {
        this.initialData[p] = data[p]
      }
    }
  }

  revert () {
    console.log('revert')
    this.saveData(this.initialData)
    this.load()
  }

  showMessage (id) {
    let message = null
    if (id === 'READY') {
      message = 'Ready.'
    }
    else if (id === 'SAVING') {
      message = 'Saving...'
    }
    else if (id === 'SAVED') {
      message = `Saved at ${new Date().toString()}`
    }
    else {
      console.warn('id', id)
      throw new Error('Unknown message id.')
    }

    if (message) {
      this.elMessage.textContent = message
    }
  }
}

// entry point
document.addEventListener('DOMContentLoaded', (event) => {
  const controller = new TaskController()
  controller.start()
})
