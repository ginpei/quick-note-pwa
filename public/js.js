if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw.js')
}

class TaskController {
  constructor (options = {}) {
    this.elText = options.elApp || document.querySelector('#text')
    this.elRevert = options.elRevert || document.querySelector('#revert')
    this.initialData = {}
  }

  start () {
    this.load()

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
    const data = { text }
    const json = JSON.stringify(data)
    localStorage.setItem('mypwa-data', json)
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
}

// entry point
document.addEventListener('DOMContentLoaded', (event) => {
  const controller = new TaskController()
  controller.start()
})
