SELECT tsquery('united & nations') @@ to_tsvector('are we really united, happy nations');
SELECT to_tsvector('are we really united, happy nations') @@ to_tsquery('united & nations');
-- Select to_tsvector('fat cat ate rat') @@ to_tsquery('cat & rat')


