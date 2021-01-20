import React from 'react'
import PropTypes from 'prop-types'
import Post from './Post'
import {Divider} from "@material-ui/core";

export default function PostList(props) {
    if (!props.posts || !props.posts.map) {
        return (<Divider />)
    }

    return (
        <div style={{marginTop: '24px'}}>
            {props.posts.map((item, i) => {
                return <Post post={item} key={i}
                             onRemove={props.removeUpdate}/>
            })}
        </div>)
}
PostList.propTypes = {
    removeUpdate: PropTypes.func.isRequired
}