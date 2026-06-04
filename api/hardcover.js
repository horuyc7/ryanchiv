export default async function handler(req, res) {
  try {
    const {
      page = 0,
      sort = "recent",
    } = req.query;

    const limit = 30;
    const offset = Number(page) * limit;
    
    const orderBy =
      sort === "rating"
        ? { rating: "desc" }
        : { created_at: "desc" };

    const statusId = sort === "current" ? 2 : 3;

    const query = `
        query GetBooks(
          $limit: Int!
          $offset: Int!
          $orderBy: [user_books_order_by!]
          $statusId: Int!
        ){
          user_books(
            where: {
              status_id: { _eq: $statusId }
              user_id: { _eq: 97364 }
            }
            limit: $limit
            offset: $offset
            order_by: $orderBy
          ) {
          rating

          book {
            id
            title
            description
            pages
            release_date
            
            image {
              url
            }

            rating
            ratings_count

            cached_contributors

            editions {
              title
              language {
                id
                language
              }
            }
          }
        }
      }
    `;

    const response = await fetch(
      "https://api.hardcover.app/v1/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HARDCOVER_TOKEN}`,
        },
        body: JSON.stringify({
          query,
          variables: {
            limit,
            offset,
            statusId,
            orderBy:
              sort === "rating"
                ? { rating: "desc" }
                : { created_at: "desc" }
          },
        }),
      }
    );

    const result = await response.json();

    res.setHeader(
      "Cache-Control",
      "s-maxage=21600, stale-while-revalidate"
    );

    res.status(200).json(result.data.user_books);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch books",
    });
  }
}