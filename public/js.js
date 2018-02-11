class TaskController {
  constructor (options = {}) {
    this.elText = options.elApp || document.querySelector('#text')
    this.initialData = {}
  }

  start () {
    this.load()

    this.elText.addEventListener('input', (event) => {
      this.save()
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
}

// entry point
document.addEventListener('DOMContentLoaded', (event) => {
  const controller = new TaskController()
  controller.start()
})
