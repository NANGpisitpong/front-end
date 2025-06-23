import Head from 'next/head'
const products = [
  {
    id: 1,
    name: 'S1000RRR',
    price: '$456855.40',
    image: 'https://i.redd.it/q6najp5gs0s61/300x300',
  },
  {
    id: 2,
    name: 'H2RR',
    price: '$109999.50',
    image: 'https://i.ytimg.com/vi/3uZaAyxeSTI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDFbyy8_vAyY9JvTVOU4tJ-B9JLnA/300x300',
  },
  {
    id: 3,
    name: 'R1MR',
    price: '$59399.06',
    image: 'https://th.bing.com/th/id/OIP.1APrsQDEYe3SJFeofC25YAHaE7?cb=iwp2&rs=1&pid=ImgDetMain/300x300',
  },
]
export default function Home() {
  return (
    <>
   <h1> Home Work IT</h1>
    </>
  );
}
