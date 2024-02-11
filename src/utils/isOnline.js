import online from 'is-online';
export default async function isOnline() {
  const status = await online()
  console.log("newtork status=>",status)
  return status;
}
