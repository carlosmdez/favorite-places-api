const sanitizeData = data => {
  const newData = { ...data }
  Object.keys(newData).map(key => {
    if (typeof newData[key] === 'string') {
      if (key === 'email') {
        newData[key] = newData[key].trim().toLowerCase()
      } else {
        newData[key] = newData[key].trim()
      }
    }
    newData[key] = newData[key]
  })
  return newData
}

module.exports = sanitizeData
