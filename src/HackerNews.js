import React from 'react';

class HackerNews extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            title: '',
            url: '',
            value: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getNews(8863);
    }

    // getNews(id) {
    //     this.setState({ isLoading: true });

    //     return fetch(`http://hacker-news.firebaseio.com/v0/item/${id}.json`)
    //         .then(response => response.json())
    //         .then(data => {
    //             const { title, url } = data;
    //             this.setState({ title, url, isLoading: false });
    //         });
    // }

    async getNews(id) {
        this.setState({ isLoading: true });
        const response = await fetch(`http://hacker-news.firebaseio.com/v0/item/${id}.json`);
        const data = await response.json();
        const { title, url } = data;
        this.setState({ title, url, isLoading: false });
    }

    handleChange(e){
        this.setState({ value: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.getNews(this.state.value);
    }

    render() {
        const { isLoading, title, url, value } = this.state;

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={value} onChange={this.handleChange} />
                    <button type="submit">submit</button>
                </form>
                {isLoading && <p>loading...</p>}
                {!isLoading && 
                <div>
                    <p>title: {title}</p>
                    <p>URL: <a href={url} target="_blank">{url}</a></p>
                </div>
                }
            </div>
        );
    }
}

export default HackerNews;