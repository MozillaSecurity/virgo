/** @format */

class LibFuzzer {
  static command = 'cat /home/worker/stats'

  static serialize = data => {
    const result = {}
    if (typeof data !== 'string') {
      return result
    }
    data.split('\n').forEach(line => {
      const pair = line.match(/\w+/g)
      if (pair && pair.length === 2) {
        result[pair[0]] = pair[1]
      }
    })
    return result
  }
}

export default {
  LibFuzzer: LibFuzzer
}
