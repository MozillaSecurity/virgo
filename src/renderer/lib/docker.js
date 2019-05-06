/** @format */
import { chain } from 'lodash'

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0 Bytes'
  }
  const k = 1024
  const dm = decimals <= 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

export const mapImage = image => {
  return {
    id: image.Id.substr(7, 12),
    size: formatBytes(image.Size),
    date: new Date(image.Created * 1000).toLocaleDateString(),
    containers: image.Containers === -1 ? 0 : image.Containers,
    tags: image.RepoTags === null ? ['N/A'] : image.RepoTags
  }
}

export const mapContainer = container => {
  return {
    id: container.Id,
    name: chain(container.Names)
      .map(n => n.substr(1))
      .join(', ')
      .value(),
    state: container.State,
    status: `${container.State} (${container.Status})`,
    image: container.Image
  }
}
