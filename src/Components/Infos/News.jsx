import React from 'react';

const newsData = [
    {
        img: 'https://via.placeholder.com/150',
        title: 'News Title 1',
        description: 'This is a short description of the news article 1.'
    },
    {
        img: 'https://via.placeholder.com/150',
        title: 'News Title 2',
        description: 'This is a short description of the news article 2.'
    },
    {
        img: 'https://via.placeholder.com/150',
        title: 'News Title 3',
        description: 'This is a short description of the news article 3.'
    }
];

const News = () => {
    return (
        <div className="news-container">
            {newsData.map((news, index) => (
                <div key={index} className="news-card">
                    <img src={news.img} alt={news.title} className="news-img" />
                    <h2 className="news-title">{news.title}</h2>
                    <p className="news-description">{news.description}</p>
                </div>
            ))}
        </div>
    );
};

export default News;