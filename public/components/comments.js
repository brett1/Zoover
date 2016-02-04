var CommentBox = React.createClass({
    getInitialState: function () {
        return {
            comments: null
        };
    },
    componentDidMount: function () {
        var that = this;
        this.socket = io();
        this.socket.on('comments', function (comments) {
            that.setState({ comments: comments });
        });
        this.socket.emit('fetchComments');
    },
    submitComment: function (comment, callback) {
        this.socket.emit('newComment', comment, function (err) {
            if (err)
                return console.error('New comment error:', err);
            callback();
        });
    },
    render: function() {
        return (
            <div className="commentBox">
                <h1>Zoover Activity</h1>
                <br />
                <h2>Here's what's going on right now.</h2>
                <CommentList comments={this.state.comments}/>
                <CommentForm submitComment={this.submitComment}/>
            </div>
        );
    }
});
var CommentList = React.createClass({
    render: function () {
        var Comments = (<div>Loading Zoover...</div>);
        if (this.props.comments) {
            Comments = this.props.comments.map(function (comment) {
                return (<Comment comment={comment} />);
            });
        }
        return (
            <div className="commentList">
				{Comments}
            </div>
        );
    }
});
var Comment = React.createClass({
    render: function () {
        return (
            <div className="comment">
                <span className="author">{this.props.comment.author}</span> said:<br/>
                <div className="body">{this.props.comment.text}</div>
            </div>
        );
    }
});
var CommentForm = React.createClass({
    handleSubmit: function (e) {
        e.preventDefault();
        var that = this;
        var author = this.refs.author.getDOMNode().value.trim();
        var text = this.refs.text.getDOMNode().value.trim();
        var comment = { author: author, text: text };
        var submitButton = this.refs.submitButton.getDOMNode();
        submitButton.innerHTML = 'Zooving...';
        submitButton.setAttribute('disabled', 'disabled');
        this.props.submitComment(comment, function (err) {
            that.refs.author.getDOMNode().value = '';
            that.refs.text.getDOMNode().value = '';
            submitButton.innerHTML = 'Zoov!';
            submitButton.removeAttribute('disabled');
        });
    },
    render: function () {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" name="author" ref="author" placeholder="Name" required /><br/>
                <textarea name="text" ref="text" placeholder="Zoover" required></textarea><br/>
                <button type="submit" ref="submitButton">Zoov!</button>
                
            </form>
        );
    }
});

React.render(
    <CommentBox/>,
    document.getElementById('content')
);