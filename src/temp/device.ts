const [temperature, setTemperature] = useState('-5|0|1|0|1|2|HM20')


useEffect(() => {
  const timeToUpdateTemperature = 800 // 800 milliseconds
  const arrayReads = createLongArray()
  let count = 0
  const tempInterval = setInterval(() => {
    if (!isChangingTargetTemp) {
      // const randomTemp = Math.random() * 1000 * 0.1 + 41000
      // dispatch(executeTest(TagTypes.READ_TEMPERATURE))
      setTemperature(`-5|${arrayReads[count]}|1|0|1|2|HM20`)
      count += 1
      if (count > arrayReads.length - 1) count = 0
    } else {
      // console.log('CANCELED_TEMP_UPDATE')
    }
  }, timeToUpdateTemperature)
  return () => clearInterval(tempInterval)
}, [dispatch, isChangingTargetTemp])


useEffect(() => {
  const arrayReads = createLongArray()
  console.log(arrayReads)
}, [])


const rawWeight = calculateNewMinimumWeight(
  Number(temperature?.split('|')[1] ?? '00'),
  kegType?.tara,
  kegType?.size,
)

const newMinimum = setWeightValue(rawWeight, kegType?.tara)
