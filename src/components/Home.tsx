import React, { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';

interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}


const Home: React.FC= () => {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [bibleVerse, setBibleVerse] = useState('');
  const [news, setNews] = useState<Article[]>([]);

  const user = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser') || '{}') : {};

  const logAction = (action: string, data: any) => {
    const timestamp = new Date().toISOString();
    const systemChurchLog = localStorage.getItem('systemChurchLog');
    const systemLog = systemChurchLog ? JSON.parse(systemChurchLog) : [];

    const logEntry = { timestamp, action, data };
    systemLog.push(logEntry);
    localStorage.setItem('systemChurchLog', JSON.stringify(systemLog));
  };

  const fetchRandomVerse = async () => {
    try {
      const response = await fetch('https://www.abibliadigital.com.br/api/verses/nvi/random');
      if (response.ok) {
        const data = await response.json();
        setBibleVerse(`${data.book.name} - Capitulo ${data.chapter}:${data.number} : ${data.text}`);
      }
    } catch (error) {
      console.error('Erro ao buscar o versículo:', error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=c371e37e62e54a08b54479d3bb9976bd');
      if (response.ok) {
        const data = await response.json();
        const filteredArticles = data.articles.filter(
          (          article: { title: string; description: string; author: string; }) =>
            article.title !== '[Removed]' &&
            article.description !== '[Removed]' &&
            article.author !== '[Removed]'
        );
        setNews(filteredArticles);
      }
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    }
  };
  

  useEffect(() => {
    const capitalizedUserName = (user.name || 'usuário').replace(/\b\w/g, (char: string) => char.toUpperCase());
    setWelcomeMessage(`Bem-vindo, ${capitalizedUserName}!`);
    fetchRandomVerse();
    fetchNews();
    logAction('HomePageLoaded', { user });
  }, []);
  

  return (
  
    <Container>
      <h2>Home </h2>
      <p>{welcomeMessage}</p>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Versículo do dia:</Card.Title>
          <Card.Text>{bibleVerse}</Card.Text>
        </Card.Body>
      </Card>

      <h3>Notícias do Dia (EUA)</h3>
      <div>
  {news.map((article, index) => (
    <Card key={index} className="mb-3">
      <div className="row g-0">
        {article.urlToImage && (
          <div className="col-md-4">
            <Card.Img
              variant="top"
              src={article.urlToImage}
              alt={article.title}
              style={{ maxWidth: '400px', maxHeight: '400px' }}
            />
          </div>
        )}
        <div className="col-md-8">
          <Card.Body>
            <Card.Title>{article.title}</Card.Title>
            <Card.Text>{article.description}</Card.Text>
            <Card.Link href={article.url} target="_blank" rel="noopener noreferrer">
              Leia mais
            </Card.Link>
          </Card.Body>
        </div>
      </div>
    </Card>
  ))}
</div>
    </Container>
  );
};

export default Home;
