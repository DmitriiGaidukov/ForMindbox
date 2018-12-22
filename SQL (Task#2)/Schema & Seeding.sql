/****** Schema ******/

CREATE DATABASE [Products]
GO

USE [Products]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Product](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](64) NOT NULL,
 CONSTRAINT [PK_dbo.Product] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO


CREATE TABLE [dbo].[Category](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](64) NOT NULL,
 CONSTRAINT [PK_dbo.Category] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO



CREATE TABLE [dbo].[ProductCategory](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [int] NOT NULL,
	[CategoryId] [int] NOT NULL,
 CONSTRAINT [PK_dbo.ProductCategory] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ProductCategory]  WITH CHECK ADD  CONSTRAINT [FK_dbo.ProductCategory_dbo.Category_CategoryId] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Category] ([Id])
GO

ALTER TABLE [dbo].[ProductCategory] CHECK CONSTRAINT [FK_dbo.ProductCategory_dbo.Category_CategoryId]
GO

ALTER TABLE [dbo].[ProductCategory]  WITH CHECK ADD  CONSTRAINT [FK_dbo.ProductCategory_dbo.Product_ProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Product] ([Id])
GO

ALTER TABLE [dbo].[ProductCategory] CHECK CONSTRAINT [FK_dbo.ProductCategory_dbo.Product_ProductId]
GO

CREATE UNIQUE NONCLUSTERED INDEX [IX_ProductIdCategoryId] ON [dbo].[ProductCategory]
(
	[ProductId] ASC,
	[CategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO


/****** Seeding ******/

insert into Category (Name)
values 
('Sport'),
('Clothes'),
('Smartphone')




insert into Product (name)
values
('Jeans'),
('Sneakers'),
('IPhone'),
('Samsung Galaxy'),
('Vacuum cleaner')



Insert into ProductCategory
values 
(1,2),
(2,1),
(2,2),
(3,3),
(4,3)

GO