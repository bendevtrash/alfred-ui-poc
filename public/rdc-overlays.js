(() => {
  const overlays = [
    { id: 'cuisine', label: 'Cuisine', temp: '21,3°', light: true },
    { id: 'salle-a-manger', label: 'Salle à manger', temp: '21,1°', light: true },
    { id: 'salon', label: 'Salon', temp: '21,2°', light: true },
    { id: 'buanderie', label: 'Buanderie', temp: '20,8°', light: false },
    { id: 'entree', label: 'Entrée', temp: '21,0°', light: true },
  ]

  const mount = () => {
    const plan = document.querySelector('.floorPlan')
    if (!plan || !plan.querySelector('.hotspot')) return
    if (plan.querySelector('.rdcTelemetry')) return

    overlays.forEach((room) => {
      const el = document.createElement('div')
      el.className = `rdcTelemetry rdcTelemetry--${room.id}`
      el.setAttribute('aria-label', `${room.label}, ${room.temp}${room.light ? ', lumière allumée' : ''}`)
      el.innerHTML = `<span>${room.label}</span><strong>${room.temp}${room.light ? ' <i aria-hidden="true">●</i>' : ''}</strong>`
      plan.appendChild(el)
    })
  }

  const observer = new MutationObserver(mount)
  observer.observe(document.documentElement, { childList: true, subtree: true })
  mount()
})()
