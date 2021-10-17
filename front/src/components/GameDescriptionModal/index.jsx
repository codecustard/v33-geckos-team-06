import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { Modal, 
         Button } from 'react-bootstrap';
import { GlobalContext } from '../../contexts/GlobalContext';

import { FollowUser, UnfollowUser, GetLink } from '../../utils/FirebaseConnector';

const GameDescriptionModal = (details) => {

    const [context, setContext] = useContext(GlobalContext);

    const [download, setDownload] = useState('');

    useEffect(() => {
        if (context?.gameDescriptionModal?.download_link?.[0])
            GetLink(context?.gameDescriptionModal?.download_link?.[0]).then( (l) => {
                console.log(`downloadLink - ${l}`);
                setDownload( l );
            }
        );
    
    }, [context?.gameDescriptionModal?.download_link])

    const handleClose = () => {
        setContext( (prevContext) => {
            return {
                ...prevContext, 
                gameDescriptionModal: {
                    show: false
                }
            }
        });
    }

    const followUser = (alreadyFollowing) => {
        if (alreadyFollowing === false) {
            if (context?.gameDescriptionModal?.author === null)
                return false;

            setContext( (p) => {
                return {...p, followers: [...p.followers, {author: context?.gameDescriptionModal?.author}] }
            })
            
            FollowUser(context?.gameDescriptionModal?.author).then( (r) => {
                if (r) {
                }
                else {
                    alert(`Failed to Follow User - ${context?.gameDescriptionModal?.author}`);
                }
            });
        } else {
            
            setContext( (p) => {
                let arr = [...p.followers];
                let index = arr.indexOf(context?.gameDescriptionModal?.author);
                arr.splice(index, 1);
                return {...p, followers: arr }
            });

            UnfollowUser(context?.gameDescriptionModal?.author).then( (r) => {
                if (r) {
                    alert(`Unfollow User - ${context?.gameDescriptionModal?.author}`);
                }
                else {
                    alert(`Failed to Unfollow User - ${context?.gameDescriptionModal?.author}`);
                }
            });
        }
    }

    const downloadLink = (link) => {

        GetLink(link[0]).then( (l) => {
            console.log(`downloadLink - ${l}`);
            setDownload( l );
        }
        );


        // props?.download_link?.map( (i) => {
        //     GetLink(i).then( (r) => {
        //         setDownloadLinks( (p) => {
        //             console.log(`setLink - ${r}`)
        //             return [ ...p, r ]
        //         })
        //     }
        //     );
        // });

        // console.log(`downloadLink - ${context?.gameDescriptionModal?.download_link}`)
        // const xhr = new XMLHttpRequest();
        // xhr.responseType = 'blob';
        // xhr.onload = (event) => {
        // const blob = xhr.response;
        // };
        // xhr.open('GET', context?.gameDescriptionModal?.download_link);
        // xhr.send();
    }

    const renderFollow = () => {
        if (context?.followers?.filter( (e) => {
            if (e.author === context?.gameDescriptionModal?.author)
                return true;
            return false;
        }))
        if (context?.followers.find( ({author}) => author === context?.gameDescriptionModal?.author)) {
            return (<a href="#" onClick={()=>{followUser(true)}}>Unfollow</a>);
        }
        else {
            return (<a href='#' onClick={()=>{followUser(false)}}>Follow</a>);
        }
    }

    return (
        <Modal show={context?.gameDescriptionModal?.show}  onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{context?.gameDescriptionModal?.game ?? ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
                {
                    context?.gameDescriptionModal?.images?.map( (i) => {
                        return <img className="game-preview" src={i} />
                    })
                }
            </div>
            Author: {context?.gameDescriptionModal?.author ?? ''}
            {
                
                context?.gameDescriptionModal?.author ?? '' !== JSON.parse(localStorage.data || null)?.user?.email ?
                    renderFollow()
                : ''
            }
            <br /><br />
            {/* Platform(s): {context?.gameDescriptionModal?.platform} <br /><br /> */}
            {context?.gameDescriptionModal?.description ?? ''} <br /><br />
            {context?.gameDescriptionModal?.genre ?? ''}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <a href={download} target='_blank'>
            <Button variant="primary" disabled={!context?.gameDescriptionModal?.download_link ?? true}>
                Download
            </Button>
          </a>
        </Modal.Footer>
      </Modal>
    );
}

export default withRouter(GameDescriptionModal);