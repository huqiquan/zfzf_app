import Axios from 'axios'

export function getCurrentCity() {
  const city = JSON.parse(localStorage.getItem('currentCity'))
  if (!city) {
    return new Promise((resolve, reject) => {
      const myCity = new window.BMap.localCity()
      myCity.get(result => {
        const name = result.name
        Axios.get('http://localhost:8080/area/info', {
          params: {
            name
          }
        })
          .then(res => {
            const { body } = res.data
            localStorage.setItem('currentCity', JSON.stringify(body))
            resolve(body)
          })
          .catch(err => {
            reject(err)
          })
      })
    })
  } else {
    return city
  }
}
