using System;
using NUnit.Framework;

namespace Shapes.Tests
{

    [TestFixture]
    public class ShapeTests
    {
        [Test]
        public void Circle_Area()
        {
            // arrange
            var circle = new Circle(5);
            // act & assert
            Assert.That(circle.Area, Is.EqualTo(78.539816).Within(0.000001));
        }

        [Test]
        public void Triangle_Area()
        {
            // arrange
            var triangle = new Triangle(3, 4, 5);
            // act & assert
            Assert.That(triangle.Area, Is.EqualTo(6));
        }

        [Test]
        public void Triangle_Right_true_1()
        {
            // arrange
            var triangle = new Triangle(3, 4, 5);
            // act & assert
            Assert.True(triangle.IsRight);
        }

        [Test]
        public void Triangle_Right_true_2()
        {
            // arrange
            var triangle = new Triangle(5, 3, 4);
            // act & assert
            Assert.True(triangle.IsRight);
        }

        [Test]
        public void Triangle_Right_false()
        {
            // arrange
            var triangle = new Triangle(4, 4, 5);
            // act & assert
            Assert.False(triangle.IsRight);
        }
    }
}
