using System;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using WSA.LogProcessor.Client;

namespace WSA.HALogProcessor.Client
{
    public class LogProcessorClient
    {
        private readonly string _logProcessorAccessPoint;
        private readonly string _clientProgram;
        private readonly string _clientSubScriptionKey;


        /// <summary>
        /// Constructor for SigningServiceClient. An instance of this class must be be created before request for signing can take place
        /// </summary>
        /// <param name="clientProgram">The clientProgram must specify the name of the application, using the Signing Service.
        ///     e.g. FitXp, WSPw, FlexTool or NLWTool.POC/1.0</param>
        /// <param name="clientSubscriptionKey">clientSubscriptionKey is a unique key that identifies the calling application.
        ///     If the key is unknown in the could signing will not take place. Value for this parameter have be provided by WCloud.</param>
        /// <param name="logProcessorAccessPoint">logProcessorAccessPoint is an optional parameter. If not defines
        ///     the access point will be fetched from Environment enum based on the environment parameter.
        ///     Otherwise the https://tst-euw-wsa-apimanagement.azure-api.net/clp/v1/api/CrashLogProcessor will be used</param>
        /// <summary>
        /// When constructing the SigningServiceClient the user must pass <see cref="clientProgramKey"></see> and <see cref="clientSubscriptionKey"></see> />.
        /// </summary>
        public LogProcessorClient(
            string clientProgram,
            string clientSubscriptionKey,
            string logProcessorAccessPoint = null)
        {
            _clientProgram = clientProgram;
            _clientSubScriptionKey = clientSubscriptionKey;
            _logProcessorAccessPoint = !string.IsNullOrEmpty(logProcessorAccessPoint) ? logProcessorAccessPoint : "https://apimgmt.widex.com/clp/v1/api/CrashLogProcessor/processArrayOfStrings";
        }

        /// <summary>
        /// IsSignatureValid - is not implemented in this service
        /// </summary>
        /// <param name="haFirmwareVersion">signature content is:
        ///   [32] Signature Part R | [32] Signature Part S</param>
        /// <param name="hexByteStrings">payloadBytes content is:
        ///   [32] Nonce | [14] HA identity</param>
        /// <returns></returns>
        public string[] ProcessHaLog(FirmwareVersion haFirmwareVersion, string[] hexByteStrings)
        {
            HttpClient httpClient = new HttpClient();
            httpClient.CancelPendingRequests();

            httpClient.DefaultRequestHeaders.Clear();
            httpClient.DefaultRequestHeaders.Add("x-ClientProgram", _clientProgram); // This is the client understood by the API Management.

            if (!string.IsNullOrEmpty(_clientSubScriptionKey))
            {
                httpClient.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", _clientSubScriptionKey);
            }

            Uri baseUri = new Uri(_logProcessorAccessPoint);
            string request = $"?firmwareVersion={haFirmwareVersion}";
            Uri requestUri = new Uri(baseUri, request);
            Debug.WriteLine(requestUri);

            var body = JsonSerializer.Serialize(new RawLog
            {
                HexStrings = hexByteStrings
            });


            var jsonContent = new StringContent(body,
                                                Encoding.UTF8,
                                                "application/json");

            Debug.WriteLine(body);

            HttpResponseMessage response = httpClient.PostAsync(requestUri, jsonContent).Result;

            response.EnsureSuccessStatusCode(); 
            var result = response.Content.ReadAsStringAsync().Result;

            var haLog = JsonSerializer.Deserialize<string[]>(result);

            return haLog;
        }
    }

    internal class RawLog
    {
        [JsonPropertyName("hex_strings"), JsonInclude]
        public string[] HexStrings;
    }

}