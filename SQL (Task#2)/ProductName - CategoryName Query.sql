

/* SQL ������ ��� ������ ���� ��� ���� �������� � ��� ���������. 
���� � �������� ��� ���������, �� ��� ��� ��� ����� ������ ����������.*/


SELECT Product.Name, Category.Name 
	FROM ProductCategory 
		JOIN Category on ProductCategory.CategoryId = Category.Id
		RIGHT JOIN Product on ProductCategory.ProductId = Product.Id
	ORDER BY Product.Name, Category.Name