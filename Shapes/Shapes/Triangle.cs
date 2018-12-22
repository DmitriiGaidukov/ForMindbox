using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Shapes
{
    public class Triangle : ShapeBase
    {
        public double Side1 { get; private set; }
        public double Side2 { get; private set; }
        public double Side3 { get; private set; }

        public Triangle(double side1, double side2, double side3)
        {
            Side1 = side1;
            Side2 = side2;
            Side3 = side3;
        }

        public override double Area {
            get
            {
                var semiPerimeter = (Side1 + Side2 + Side3) / 2;
                return Math.Sqrt(semiPerimeter * (semiPerimeter - Side1) * (semiPerimeter - Side2) * (semiPerimeter - Side3));
            }
        }

        /// <summary>
        /// Checks whether the triangle is right angled 
        /// </summary>
        public bool IsRight
        {
            get
            {
                var sidesOrdered = new[] { Side1, Side2, Side3 }.OrderByDescending(x => x).ToList();

                return sidesOrdered[0] * sidesOrdered[0] == sidesOrdered[1] * sidesOrdered[1] + sidesOrdered[2] * sidesOrdered[2];
            }
        }
    }
}
