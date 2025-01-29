
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ibcraftservice.TestController
{
    [Route("[controller]")]
    [ApiController]
    
    public class TestController : ControllerBase
    {
        [HttpGet("get-data")]
        [Authorize]
        public IActionResult GetData()
        {
            var data = new { message = "Hello from ASP.NET!" };
            return Ok(data);
        }

        [HttpPost("send-data")]
        [Authorize]
        public IActionResult SendData([FromBody] MyData model)
        {
            // Обработать модель
            return Ok(new { 
                status = "Data received",
                age = model.Age,
                name = model.Name
            });
        }
    }

}

public class MyData
{
    public string Name { get; set; }
    public int Age { get; set; }
}

