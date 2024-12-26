import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Youtube,
  } from 'lucide-react';

const links = [
    {
      name: 'Facebook',
      icon: <Facebook style={{
        backgroundColor: 'blue',
        fill: 'white',
        stroke: 'none',
        borderRadius: '4px',
        padding: '2px'
      }}/>,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin style={{
        backgroundColor: 'blue',
        fill: 'white',
        stroke: 'none',
        borderRadius: '4px',
        padding: '2px'
      }}/>,
    },
    {
      name: 'Twitter',
      icon: <Twitter style={{
        backgroundColor: 'blue',
        fill: 'white',
        stroke: 'none',
        borderRadius: '4px',
        padding: '2px'
      }}/>,
    },
    {
      name: 'Instagram',
      icon: <Instagram style={{
        backgroundColor: 'red',
        stroke: 'white',
        fill: 'red',
        borderRadius: '4px',
        padding: '2px'
      }}/>,
    },
    {
      name: 'Youtube',
      icon: <Youtube style={{
        backgroundColor: 'white',
        fill: 'red',
        stroke: 'white',
        borderRadius: '4px',
      }}/>,
    },
  ];

  export default links