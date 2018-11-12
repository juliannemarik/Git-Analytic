import * as d3 from 'd3'

// X DOMAIN FUNCTION
export const xDomainFunc = (commits, pulls) => {
  let commitMax = commits.length
    ? new Date(commits[0].date)
    : new Date('January 1, 2018')
  let commitMin = commits.length
    ? new Date(commits[commits.length - 1].date)
    : new Date('January 1, 2017')
  let pullMax = pulls[0] ? new Date(pulls[0].dateCreated) : commitMax
  let pullMin = pulls[pulls.length - 1]
    ? new Date(pulls[pulls.length - 1].dateCreated)
    : commitMin

  let minDate = new Date(Math.min.apply(null, [commitMin, pullMin]))
  let maxDate = new Date(Math.max.apply(null, [commitMax, pullMax]))

  return [minDate, maxDate]
}

// Y DOMAIN FUNCTION
export const yDomainFunc = () => {
  const minTime = new Date('January 1, 2000, 01:00:0')
  const maxTime = new Date('January 1, 2000, 23:59:59')
  return [minTime, maxTime]
}

// MOUSE OVER FUNCTION
export function handleMouseOver(d, i){
  console.log('MOUSED OVER')
  d3
    .select(this)
    .style('opacity', 1)
    .attr('r', '10px')
}

// MOUSE OUT FUNCTION
export function handleMouseOut(){
  d3
    .select(this)
    .attr('r', '5px')
    .style('opacity', 0.5)
}
