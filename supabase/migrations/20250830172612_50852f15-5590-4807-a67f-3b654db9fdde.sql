-- Test the zuhu-pipeline-validator with a sample content processing
INSERT INTO zuhu_content_processing (content_id, raw_content, status)
VALUES (
  'test-bulletproof-' || generate_random_uuid()::text,
  '[{
    "shipped_content": "# Test Article\n\nThis is a test article with images.\n\n![Test Image](https://via.placeholder.com/300x200)\n\nSome content here.",
    "assets_manager_details": {
      "images": [
        {
          "image_1": {
            "link": "https://via.placeholder.com/600x400",
            "where_to_place": "header",
            "alt_text": "Placeholder image for testing"
          }
        }
      ],
      "tables": [
        {
          "table_1": {
            "title": "Sample Data Table",
            "where_to_place": "middle",
            "description": "A test table with sample data"
          }
        }
      ]
    },
    "seo_details": {
      "title": "Test Article Title",
      "description": "This is a test article for validation",
      "keywords": ["test", "validation"],
      "meta_tags": [],
      "canonical_url": "/test-article",
      "author": "Test Author"
    }
  }]'::jsonb,
  'received'
)
RETURNING content_id;