import _ from 'lodash'
import moment from 'moment'

export default (profiles, user, swipedProfiles) => {
  
  // the reject user card from the stackt
  const rejectMe = _.reject(profiles, profile => profile.uid === user.uid)
  
  // filtering by the gender preference of the user 
  const filterGender = _.filter(rejectMe, profile => {
    
   

    const userShowMenCardio = user.showCardio && user.gender === 'male'
    const userShowWomenCardio = user.showCardio && user.gender === 'female'

    const profileShowMenCardio =  profile.showCardio && user.gender === 'male'
    const profileShowWomenCardio =  profile.showCardio && user.gender === 'female'

    const userShowMenWeightLifting= user.showWeightLifting && user.gender === 'male'
    const userShowWomenWeightLifting = user.showWeightLifting && user.gender === 'female'

    const profileShowMenWeightLifting =  profile.showWeightLifting && user.gender === 'male'
    const profileShowWomenWeightLifting =  profile.showWeightLifting && user.gender === 'female'




    return  (userShowMenCardio || userShowWomenCardio) && (profileShowMenCardio || profileShowWomenCardio)  || (userShowMenWeightLifting || userShowWomenWeightLifting) && (profileShowMenWeightLifting || profileShowWomenWeightLifting)
  })



  const userBirthday = moment(user.birthday, 'MM/DD/YYYY')
  const userAge = moment().diff(userBirthday, 'years')

  const filterAgeRange = _.filter(filterGender, profile => {
    const profileBirthday = moment(profile.birthday, 'MM/DD/YYYY')
    const profileAge = moment().diff(profileBirthday, 'years')

    const withinRangeUser = _.inRange(profileAge, user.ageRange[0], user.ageRange[1] + 1)
    const withinRangeProfile = _.inRange(userAge, profile.ageRange[0], profile.ageRange[1] + 1)

    return withinRangeUser && withinRangeProfile
  })

  const filtered = _.uniqBy(filterAgeRange, 'uid')

  const filterSwiped = _.filter(filtered, profile => {
    const swiped = profile.uid in swipedProfiles
    return !swiped
  })
  return filterSwiped
}