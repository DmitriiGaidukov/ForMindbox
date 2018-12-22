using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BCL.WebBCL;
using BusinessLayerLibrary.BusinessLayer.KSK_Customer;
using BusinessLayerLibrary.BusinessLayer.Letters;
using BusinessLayerLibrary.Extensions;
using BusinessLayerLibrary.Integration.NUnit.TestHelpers;
using BusinessLayerLibrary.Services.BCL;
using BusinessLayerLibrary.Services.D10Task.Letters.WritingCommentServices;
using LightInject;
using NSubstitute;
using NUnit.Framework;
using Core.Interfaces;
using BusinessLayerLibrary.Helpers;
using System.Web.Http;

namespace BusinessLayerLibrary.Integration.NUnit.BusinessLayer.Letters
{
	[TestFixture]
	class LetterToComment_StubbingFirstForma_ResultedInException: TestBase
	{
		private InLetterUtils InLetterUtils;

		public SendOutLetterToSingleRecipientParams OutLetterInput;
		public InsertNewLetterWithUnificationParams InLetterInput;

		public OutLetterService OutLetterService { get; set; }


        [OneTimeSetUp]
        public void Init()
        {
           
            Container.Register(factory => GetServiceStub());

            InLetterUtils = new InLetterUtils();

            OutLetterInput = LetterToCommentHelpers.GetOutLetterValidParams();
            InLetterInput = LetterToCommentHelpers.SendInLetterValidParams();

            LetterToCommentHelpers.WriteExternalUrlToLog();

            Container.InjectProperties(this);
        }

		public static IWritingCommentService GetServiceStub()
		{
			var fakeService = Substitute.For<IWritingCommentService>();

			fakeService
				.When(s => s.CustomerZonePostComment(Arg.Any<CustomerZonePostCommentParams>()))
				.Do(x => { throw new Exception("1F error"); });
			fakeService
				.When(s => s.AddUserComment(Arg.Any<AddUserCommentParams>()))
				.Do(x => { throw new Exception("1F error"); });

			return fakeService;
		}

		[Test]
		public void SendOutLetter_Exception_Exception()
		{
			var ex = Assert.Catch<LetterUnificationException>(
				() => OutLetterService.SendOutLetterToSingleRecipient(OutLetterInput));
			StringAssert.Contains("1F error", ex.InnerException?.InnerException?.Message);
		}

		[Test]
		public void SendInLetter_IncorrectCommentId_PartiallyWorked()
		{
			var res = InLetterUtils.InsertNewLetterWithUnification(InLetterInput);
			Assert.Greater(res.LetterId, 0);
			Assert.AreEqual(res.TopicId, 0);
			Assert.AreEqual(res.CommentId, 0);
		}
	}
}
