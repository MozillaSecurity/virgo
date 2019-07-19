/** @format */

export const LibFuzzerFormatter = data => {
  const result = {}
  data.split('\n').forEach(line => {
    const [k, v] = line.match(/\w+/g)
    result[k] = v
  })
  return result
}
